package beetle.brindi.cards;

import beetle.brindi.cards.controller.SigningUpController;
import beetle.brindi.cards.domain.Context;
import beetle.brindi.cards.domain.Session;
import beetle.brindi.cards.dto.DTOplayer;
import beetle.brindi.cards.request.SigningUpRequest;
import beetle.brindi.cards.request.SigningUpRequestWrapper;
import beetle.brindi.cards.response.SigningUpResponse;
import cucumber.api.Scenario;
import cucumber.api.java.Before;
import cucumber.api.java8.En;
import org.junit.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

public class CardsCucumberStepDefinitions extends SpringCucumberIntegrationTests implements En {

    private final Logger log = LoggerFactory.getLogger(CardsCucumberStepDefinitions.class);
    private final String baseUrl = "ws://localhost:8080/cards-ws";

    protected Context context;

    @Before
    public void beforeScenario(Scenario scenario) {
        context =  new Context();
        signingUpController.flush();
    }

    @Autowired
    protected SigningUpController signingUpController;


    public CardsCucumberStepDefinitions() {

        Given("player {word} opens a new session", (String playerName) -> {

            String sessionId = playerName;
            UUID playerUuid = UUID.randomUUID();
            context.put(playerName, Context.ContextKind.SESSION, new Session(sessionId, playerUuid));
            context.put("currentPlayer", Context.ContextKind.STRING, playerName);

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUuid)
                            .playerName("")
                            .gameName("")
                            .typeRequest(SigningUpRequest.TypeRequest.GAMES_AND_PLAYERS)
                            .build()
                    ).build();
            SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(sessionId));

        });
        Given("session is of player {word}", (String playerName) -> {

            context.put("currentPlayer", Context.ContextKind.STRING, playerName);
        });

        Given("the player creates new game {word}", (String gameName) -> {

            String playerName = (String)context.get("currentPlayer", Context.ContextKind.STRING);
            String sessionId = playerName;
            Session currentSession = (Session)context.get(playerName, Context.ContextKind.SESSION);
            UUID playerUuid = currentSession.getPlayerUuid();

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUuid)
                            .playerName(playerName)
                            .gameName(gameName)
                            .typeRequest(SigningUpRequest.TypeRequest.CREATE)
                            .build()
                    ).build();

            SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(sessionId));
            signingUpResponse.getSignupPersonalResponse().ifPresent(
                    personalResponse -> {
                        context.put(gameName, Context.ContextKind.GAME, personalResponse.getGameUuid());
                    }
            );
        });
        Then("there is a game with name {word}", (String gameName) -> {

            String playerName = (String)context.get("currentPlayer", Context.ContextKind.STRING);
            String sessionId = playerName;
            Session currentSession = (Session)context.get(playerName, Context.ContextKind.SESSION);
            UUID playerUuid = currentSession.getPlayerUuid();

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUuid)
                            .playerName("")
                            .gameName("")
                            .typeRequest(SigningUpRequest.TypeRequest.GAMES_AND_PLAYERS)
                            .build()
                    ).build();
            SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(sessionId));

            AtomicReference<Boolean> gamePresent = new AtomicReference<>(Boolean.FALSE);
            signingUpResponse.getSignupPersonalResponse().ifPresent(
                    personalResponse -> {
                        personalResponse.getGames().stream().filter(game -> gameName.equals(game.getGameName()))
                                .findFirst().ifPresent(game -> gamePresent.set(Boolean.TRUE));
                    });
            Assert.assertTrue((Boolean)gamePresent.get());
        });
        Then("the available games are {word}", (String gameNamesString) -> {

            String playerName = (String)context.get("currentPlayer", Context.ContextKind.STRING);
            String sessionId = playerName;
            Session currentSession = (Session)context.get(playerName, Context.ContextKind.SESSION);
            UUID playerUuid = currentSession.getPlayerUuid();

            Set<String> gameNames = new HashSet<>( Arrays.asList(gameNamesString.split(",")) );

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUuid)
                            .playerName("")
                            .gameName("")
                            .typeRequest(SigningUpRequest.TypeRequest.GAMES_AND_PLAYERS)
                            .build()
                    ).build();
            SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(sessionId));

            AtomicReference<Set<String>> gamesPresent = new AtomicReference<>(new HashSet<>());
            signingUpResponse.getSignupPersonalResponse().ifPresent(
                    personalResponse -> {
                        gamesPresent.set(personalResponse.getGames().stream().map(game -> game.getGameName()).collect(Collectors.toSet()));
                    });
            Assert.assertTrue(equals(gameNames, (Set<String>) gamesPresent.get()));
        });

        Given("the player joins the game {word}", (String gameName) -> {

            String playerName = (String)context.get("currentPlayer", Context.ContextKind.STRING);
            String sessionId = playerName;
            Session currentSession = (Session)context.get(playerName, Context.ContextKind.SESSION);
            UUID playerUuid = currentSession.getPlayerUuid();
            UUID gameUuid = UUID.fromString(( String)context.get(gameName, Context.ContextKind.GAME));

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUuid)
                            .playerName(playerName)
                            .gameUuid(gameUuid)
                            .typeRequest(SigningUpRequest.TypeRequest.JOIN)
                            .build()
                    ).build();

            SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(sessionId));
        });
        Then("the game {word} exists with players {word}", (String gameName, String playersString) -> {

            String playerName = (String)context.get("currentPlayer", Context.ContextKind.STRING);
            String sessionId = playerName;
            Session currentSession = (Session)context.get(playerName, Context.ContextKind.SESSION);
            UUID playerUuid = currentSession.getPlayerUuid();
            UUID gameUuid = UUID.fromString(( String)context.get(gameName, Context.ContextKind.GAME));

            Set<String> players = new HashSet<>( Arrays.asList(playersString.split(",")) );

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUuid)
                            .playerName("")
                            .gameName("")
                            .typeRequest(SigningUpRequest.TypeRequest.GAMES_AND_PLAYERS)
                            .build()
                    ).build();
            SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(sessionId));

            AtomicReference<Boolean> gamePresent = new AtomicReference<>(Boolean.FALSE);
            signingUpResponse.getSignupPersonalResponse().ifPresent(
                    personalResponse -> {
                        personalResponse.getGames().stream().filter(game -> gameName.equals(game.getGameName()))
                                .findFirst().ifPresent(game -> gamePresent.set(Boolean.TRUE));
                    });
            Assert.assertTrue((Boolean)gamePresent.get());

            AtomicReference<List<DTOplayer>> playersPresent = new AtomicReference<>(new ArrayList<>());
            signingUpResponse.getSignupPersonalResponse().ifPresent(
                    personalResponse -> {
                        personalResponse.getGames().stream().filter(game -> gameName.equals(game.getGameName()))
                                .findFirst().ifPresent(game -> playersPresent.set(game.getPlayers()));
                    });
//            AtomicReference<List<String>> playerNamesPresent = new AtomicReference<>(new ArrayList<>());
            List<String> playerNamesPresent = playersPresent.get().stream().map(player -> player.getPlayerName()).collect(Collectors.toList());
            Assert.assertTrue(equals(players, new HashSet<>(playerNamesPresent)));
        });
    }

    private boolean equals(Set<?> set1, Set<?> set2){
        if(set1 == null || set2 ==null){
            return false;
        }

        if(set1.size() != set2.size()){
            return false;
        }

        return set1.containsAll(set2);
    }

//    @ParameterType("(N2|N3|N4|N5|N6|N7|N8|N9|N10|JACK|QUEEN|KING|ACE)(CLUBS|DIAMONDS|HEARTS|SPADES)(DARK|LIGHT)")
//    private DTOcard card(String card){
//
//    }
}
