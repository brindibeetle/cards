package beetle.brindi.cards;

import beetle.brindi.cards.controller.PlayController;
import beetle.brindi.cards.controller.SigningUpController;
import beetle.brindi.cards.domain.Context;
import beetle.brindi.cards.domain.Session;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOplayer;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.request.PlayRequest;
import beetle.brindi.cards.request.SigningUpRequest;
import beetle.brindi.cards.request.SigningUpRequestWrapper;
import beetle.brindi.cards.response.PlayingResponse;
import beetle.brindi.cards.response.SigningUpResponse;
import io.cucumber.cucumberexpressions.CaptureGroupTransformer;
import io.cucumber.cucumberexpressions.ParameterType;
import io.cucumber.datatable.DataTable;
import io.cucumber.java8.En;
import org.junit.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import static beetle.brindi.cards.domain.Context.ContextKind.TABLE;

//@Ignore
public class CardsCucumberStepDefinitions extends SpringCucumberIntegrationTests implements En {

    private final Logger log = LoggerFactory.getLogger(CardsCucumberStepDefinitions.class);
    private final String baseUrl = "ws://localhost:8080/cards-ws";

    protected Context context;

    @Autowired
    protected SigningUpController signingUpController;

    @Autowired
    protected PlayController playController;

    public CardsCucumberStepDefinitions() {


        Before(1, () -> {
            context =  new Context();
            signingUpController.flush();
        });

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
                        context.put("currentGame", Context.ContextKind.STRING, gameName);
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

        And("the player starts the game", () -> {
            Session currentSession = getCurrentSession();
            UUID playerUuid = currentSession.getPlayerUuid();
            String gameName = (String)context.get("currentGame", Context.ContextKind.STRING);
            UUID gameUuid = UUID.fromString ((String)context.get(gameName, Context.ContextKind.GAME));

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .gameUuid(gameUuid)
                            .typeRequest(SigningUpRequest.TypeRequest.START)
                            .build()
                    ).build();
            SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(currentSession.getSessionId()));

             context.put("TABLE", Context.ContextKind.TABLE, new ArrayList<List<DTOcard>>());
        });

        And("the dealer gives the following cards:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<DTOcard> cards = new ArrayList<>();
            data.forEach(row -> cards.add(new DTOcard(row.get(0), row.get(1), row.get(2), row.get(3))));

            doPlayRequest(PlayRequest.TypeRequest.GET_FROM_STACK, cards);
        });

        And("the player holds the following cards:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<DTOcard> cards = new ArrayList<>();
            data.forEach(row -> cards.add(new DTOcard(row.get(0), row.get(1), row.get(2), row.get(3))));

            Assert.assertArrayEquals("handcards dont match", cards.toArray(), getCurrentSession().getCards().toArray() );
        });

        And("the player takes card {word} of {word} with {word} back from stock", (String rank, String suit, String back) -> {
            DTOcard card = new DTOcard(suit, rank, back,"");

            List<DTOcard> cards = new ArrayList<>();
            cards.add(card);

            doPlayRequest(PlayRequest.TypeRequest.GET_FROM_STACK, cards);
        });

        And("the player takes card {word} with {word} back from stock", (String specialType, String back) -> {
            DTOcard card = new DTOcard("", "", back,specialType);

            List<DTOcard> cards = new ArrayList<>();
            cards.add(card);

            doPlayRequest(PlayRequest.TypeRequest.GET_FROM_STACK_TOP, cards);
        });

        And("the player lays the following cards on the table:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<DTOcard> cards = new ArrayList<>();
            data.forEach(row -> cards.add(new DTOcard(row.get(0), row.get(1), row.get(2), row.get(3))));

            doPlayRequest(PlayRequest.TypeRequest.PUT_ON_TABLE, cards);
        });

    }

    private void ParameterType(String suit, String s, Class<DTOcard> dtoCardClass, CaptureGroupTransformer<String> stringCaptureGroupTransformer) {
        new ParameterType<DTOcard>("card", "JOKER", DTOcard.class, new CaptureGroupTransformer<DTOcard>() {
            @Override
            public DTOcard transform(String[] args) {
                if ("JOKER".equals(args[0]))
                    return new DTOcard("", "", args[4], args[0]);
                else
                    return new DTOcard(args[3], args[2], args[4],  "");
            }
        });
    }


    private Session getCurrentSession() {
        String playerName = (String)context.get("currentPlayer", Context.ContextKind.STRING);
        String sessionId = playerName;
        return (Session)context.get(playerName, Context.ContextKind.SESSION);
    }

    private void doPlayRequest(PlayRequest.TypeRequest typeRequest, List<DTOcard> cards) {
        String playerName = (String)context.get("currentPlayer", Context.ContextKind.STRING);
        String sessionId = playerName;
        Session currentSession = (Session)context.get(playerName, Context.ContextKind.SESSION);
        UUID playerUuid = currentSession.getPlayerUuid();
        String gameName = (String)context.get("currentGame", Context.ContextKind.STRING);
        UUID gameUuid = UUID.fromString ((String)context.get(gameName, Context.ContextKind.GAME));

        PlayRequest playRequest = PlayRequest.builder()
                .playerUuid(playerUuid)
                .gameUuid(gameUuid)
                .typeRequest(typeRequest)
                .cards(cards)
                .build();

        PlayingResponse playingResponse = playController.play(playRequest);
        playingResponse.getGameResponse().ifPresent(
                gameResponse -> {
                    switch (gameResponse.getTypeResponse()) {
                        case GAME:
                            context.put("players", Context.ContextKind.PLAYERS, gameResponse.getPlayers());
                            context.put("currentPlayer", Context.ContextKind.STRING, gameResponse.getCurrentPlayer().getPlayerName());
                            break;
                        case PLAYERS:
                            context.put("players", Context.ContextKind.PLAYERS, gameResponse.getPlayers());
                            break;
                        default:
                            throw new CardsException(HttpStatus.CONFLICT, "Unanticipated gameResponseType : " + gameResponse.getTypeResponse());

                    }
                });
        playingResponse.getPlayResponse().ifPresent(

                playResponse -> {
                    switch (playResponse.getTypeResponse()) {
                        case DEAL:
                            context.put("topCardBack", Context.ContextKind.PLAYERS, playResponse.getTopCardBack());
                            context.put("bottomBack", Context.ContextKind.PLAYERS, playResponse.getBottomCard());
                            break;
                        case PUT_ON_TABLE:
                            List<List<DTOcard>> tableCards = (List<List<DTOcard>>)context.get("TABLE", Context.ContextKind.TABLE);
                            if (tableCards == null)
                                tableCards = new ArrayList<>();
                            if (playResponse.getCards().size() > 0)
                                tableCards.add(playResponse.getTablePosition(), playResponse.getCards());
                            context.put(TABLE, tableCards);
                            context.put( Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put(Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case SLIDE_ON_TABLE:
                            tableCards = (List<List<DTOcard>>)context.get("TABLE", Context.ContextKind.TABLE);
                            if (tableCards == null)
                                tableCards = new ArrayList<>();
                            if (playResponse.getCards().size() > 0)
                                tableCards.add(playResponse.getTablePosition(), playResponse.getCards());
                            context.put(TABLE, tableCards);
                            context.put( Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put(Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case PUT_ON_STACK_BOTTOM:
                            context.put( Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put(Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case GET:
                            context.put( Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put(Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        // case START:
                        //
                        default:
                            throw new CardsException(HttpStatus.CONFLICT, "Unanticipated playResponseType : " + playResponse.getTypeResponse());

                    }
                });
        playingResponse.getHandResponse().ifPresent(
                handResponse -> {
                    switch (handResponse.getTypeResponse()) {
                        case DEAL:
                            currentSession.setCards(handResponse.getCards());
                            break;
                        case PUT_ON_TABLE:
                            currentSession.getCards().removeAll(cards);
                            break;
                        case SLIDE_ON_TABLE:
                            currentSession.getCards().removeAll(handResponse.getCards());
                            break;
                        case PUT_ON_STACK_BOTTOM:
                            currentSession.getCards().removeAll(handResponse.getCards());
                            break;
                        case GET:
                            currentSession.getCards().addAll(handResponse.getCards());
                            break;
                        default:
                            throw new CardsException(HttpStatus.CONFLICT, "Unanticipated handResponseType : " + handResponse.getTypeResponse());

                    }
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

}
