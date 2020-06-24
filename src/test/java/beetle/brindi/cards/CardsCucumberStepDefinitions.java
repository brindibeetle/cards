package beetle.brindi.cards;

import beetle.brindi.cards.controller.PlayController;
import beetle.brindi.cards.controller.SigningUpController;
import beetle.brindi.cards.domain.Context;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOgame;
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
import java.util.stream.Collectors;

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
            DTOplayer player = new DTOplayer(playerName, playerUuid, Player.Status.PLAYING);

            context.put(playerName, Context.ContextKind.SESSIONID, sessionId);
            context.put(playerName, Context.ContextKind.PLAYER, player);

            context.put("", Context.ContextKind.CURRENTPLAYER, playerName);

            doSignupRequest(SigningUpRequest.TypeRequest.GAMES_AND_PLAYERS, playerName, "");

        });
        Given("session is of player {word}", (String playerName) -> {

            context.put("", Context.ContextKind.CURRENTPLAYER, playerName);
        });

        Given("the player creates new game {word}", (String gameName) -> {

            String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
//            String sessionId = playerName;
//            Session currentSession = (Session)context.get(playerName, Context.ContextKind.SESSION);
//            UUID playerUuid = currentSession.getPlayerUuid();
            DTOgame game = new DTOgame(gameName, Boolean.FALSE, null, new ArrayList<DTOplayer>());
            context.put(gameName, Context.ContextKind.GAME, game);
            context.put("", Context.ContextKind.CURRENTGAME, gameName);

            doSignupRequest(SigningUpRequest.TypeRequest.CREATE, playerName, gameName);
        });
        Then("there should be a game with name {word}", (String gameName) -> {

            String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);

            DTOgame game = (DTOgame) context.get(gameName, Context.ContextKind.GAME);

            Assert.assertNotNull("Game should not be null: " + gameName, game);
        });

        Then("the available games should be {word}", (String gameNamesString) -> {

            Set<String> gameNamesExpected = new HashSet<>( Arrays.asList(gameNamesString.split(",")) );

            Set<String> gameNamesPresent = new HashSet<>();
            context.getAllOfKind(Context.ContextKind.GAME, DTOgame.class).forEach(game -> {
                gameNamesPresent.add(game.getGameName());
            });

            Assert.assertTrue(equals(gameNamesExpected, gameNamesPresent));
        });

        Given("the player joins the game {word}", (String gameName) -> {

            String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
            context.put("", Context.ContextKind.CURRENTGAME, gameName);

            doSignupRequest(SigningUpRequest.TypeRequest.JOIN, playerName, gameName);
        });

        Then("the game {word} should exist with players {word}", (String gameName, String playersString) -> {

            Set<String> playerNamesExpected = new HashSet<>( Arrays.asList(playersString.split(",")) );

            Set<String> playerNamesActual = context.getAllIdsOfKindAndValue(Context.ContextKind.PLAYEROF, gameName).stream().collect(Collectors.toSet());

            Assert.assertTrue(equals(playerNamesExpected, playerNamesActual));
        });

        And("the player starts the game", () -> {

            String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
            String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);

            doSignupRequest(SigningUpRequest.TypeRequest.START, playerName, gameName);

            context.put("", Context.ContextKind.CURRENTGAME, gameName);
            context.put("", Context.ContextKind.TABLE, new ArrayList<List<DTOcard>>());
        });

        And("the dealer gives the following cards:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<DTOcard> cards = new ArrayList<>();
            data.forEach(row -> cards.add(new DTOcard(row.get(0), row.get(1), row.get(2), row.get(3))));

            String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
            context.put(playerName, Context.ContextKind.PLAYERCARDS, new ArrayList<>());

            doPlayRequest(PlayRequest.TypeRequest.GET_FROM_STACK, cards);
        });

        Then("the player should hold the following cards:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<DTOcard> cards = new ArrayList<>();
            data.forEach(row -> cards.add(new DTOcard(row.get(0), row.get(1), row.get(2), row.get(3))));

//            Assert.assertArrayEquals("handcards dont match", cards.toArray(), getCurrentSession().getCards().toArray() );
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
        And("the player puts the card {word} of {word} with {word} back on bottom of stock", (String rank, String suit, String back) -> {
            DTOcard card = new DTOcard(suit, rank, back,"");

            List<DTOcard> cards = new ArrayList<>();
            cards.add(card);

            doPlayRequest(PlayRequest.TypeRequest.PUT_ON_STACK_BOTTOM, cards);
        });

        Then("the player {word} should have no cards in his/her hands", (String playerName) -> {

            List<DTOcard>cards = (List<DTOcard>)context.get(playerName, Context.ContextKind.PLAYERCARDS);

            Assert.assertEquals( "hand should be empty", 0, cards.size() );
        });

        Then("the player {word} should be finished", (String playerName) -> {

            DTOplayer player = (DTOplayer)context.get(playerName, Context.ContextKind.PLAYER);

            Assert.assertEquals( "player should be finished", Player.Status.FINISHED, player.getPlayerStatus() );
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


    private DTOplayer getCurrentPlayer() {
        String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
        DTOplayer player = (DTOplayer) context.get(playerName, Context.ContextKind.PLAYER);

        if (player == null) {
            throw(new CardsException(HttpStatus.CONFLICT, "Player not present : " + playerName));
        }
        else
            return player;
    }

    private void doSignupRequest(SigningUpRequest.TypeRequest typeRequest, String playerName, String gameName) {
        String sessionId = playerName;
        UUID playerUUID = ((DTOplayer) context.get(playerName, Context.ContextKind.PLAYER)).getPlayerUuid();

        SigningUpRequestWrapper signingUpRequestWrapper ;
        if ("".equals(gameName)) {
            signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUUID)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUUID)
                            .playerName(playerName)
                            .typeRequest(typeRequest)
                            .build()
                    ).build();
        }
        else {
            UUID gameUUID = ((DTOgame) context.get(gameName, Context.ContextKind.GAME)).getGameUuid();
            if (gameUUID == null) {
                signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                        .playerUuid(playerUUID)
                        .signupRequest(SigningUpRequest.builder()
                                .playerUuid(playerUUID)
                                .playerName(playerName)
                                .gameName(gameName)
                                .typeRequest(typeRequest)
                                .build()
                        ).build();
            } else {
                signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                        .playerUuid(playerUUID)
                        .signupRequest(SigningUpRequest.builder()
                                .playerUuid(playerUUID)
                                .playerName(playerName)
                                .gameName(gameName)
                                .gameUuid(gameUUID)
                                .typeRequest(typeRequest)
                                .build()
                        ).build();
            }
        }

        SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders(sessionId));

        signingUpResponse.getSignupPersonalResponse().ifPresent(
                personalResponse -> {

                }
        );

        signingUpResponse.getSignupAllResponse().ifPresent(
                allResponse -> {
                    List<DTOgame> games = allResponse.getGames();
                    games.forEach( game -> {
                        context.put(game.getGameName(), Context.ContextKind.GAME, game);
                        game.getPlayers().forEach( player -> {
                                    context.put(player.getPlayerName(), Context.ContextKind.PLAYEROF, game.getGameName());
                                });
                    });
                });
    }

    private void doPlayRequest(PlayRequest.TypeRequest typeRequest, List<DTOcard> cards) {
        String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
        String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);
        String sessionId = playerName;
        UUID playerUUID = ((DTOplayer) context.get(playerName, Context.ContextKind.PLAYER)).getPlayerUuid();
        UUID gameUuid = ((DTOgame)context.get(gameName, Context.ContextKind.GAME)).getGameUuid();

        PlayRequest playRequest = PlayRequest.builder()
                .playerUuid(playerUUID)
                .gameUuid(gameUuid)
                .typeRequest(typeRequest)
                .cards(cards)
                .build();

        PlayingResponse playingResponse = playController.play(playRequest);
        playingResponse.getGameResponse().ifPresent(
                gameResponse -> {
                    switch (gameResponse.getTypeResponse()) {
                        case GAME:
                            context.putList(Context.ContextKind.PLAYER, gameResponse.getPlayers(), DTOplayer::getPlayerName);
                            context.put("", Context.ContextKind.CURRENTPLAYER, gameResponse.getCurrentPlayer().getPlayerName());
                            break;
                        case PLAYERS:
                            context.putList(Context.ContextKind.PLAYER, gameResponse.getPlayers(), DTOplayer::getPlayerName);
                            break;
                        default:
                            throw new CardsException(HttpStatus.CONFLICT, "Unanticipated gameResponseType : " + gameResponse.getTypeResponse());

                    }
                });
        playingResponse.getPlayResponse().ifPresent(

                playResponse -> {
                    switch (playResponse.getTypeResponse()) {
                        case DEAL:
                            context.put("", Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put("", Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case PUT_ON_TABLE:
                            List<List<DTOcard>> tableCards = (List<List<DTOcard>>)context.get("", Context.ContextKind.TABLE);
                            if (tableCards == null)
                                tableCards = new ArrayList<>();
                            if (playResponse.getCards().size() > 0)
                                tableCards.add(playResponse.getTablePosition(), playResponse.getCards());
                            context.put("", Context.ContextKind.TABLE, tableCards);
                            context.put( "", Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put("", Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case SLIDE_ON_TABLE:
                            tableCards = (List<List<DTOcard>>)context.get("", Context.ContextKind.TABLE);
                            if (tableCards == null)
                                tableCards = new ArrayList<>();
                            if (playResponse.getCards().size() > 0)
                                tableCards.add(playResponse.getTablePosition(), playResponse.getCards());
                            context.put("", Context.ContextKind.TABLE, tableCards);
                            context.put("", Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put("", Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case PUT_ON_STACK_BOTTOM:
                            context.put( "",Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put("", Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case GET:
                            context.put( "", Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put("", Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        // case START:
                        //
                        default:
                            throw new CardsException(HttpStatus.CONFLICT, "Unanticipated playResponseType : " + playResponse.getTypeResponse());

                    }
                });
        List<DTOcard> playerCards = (List<DTOcard>)context.get(playerName, Context.ContextKind.PLAYERCARDS);
        playingResponse.getHandResponse().ifPresent(
                handResponse -> {
                    switch (handResponse.getTypeResponse()) {
                        case DEAL:
                            context.put(playerName, Context.ContextKind.PLAYERCARDS, handResponse.getCards());
                            break;
                        case PUT_ON_TABLE:
                            playerCards.removeAll(cards);
                            context.put(playerName, Context.ContextKind.PLAYERCARDS, playerCards);
                            break;
                        case SLIDE_ON_TABLE:
                            playerCards.removeAll(cards);
                            context.put(playerName, Context.ContextKind.PLAYERCARDS, playerCards);
                            break;
                        case PUT_ON_STACK_BOTTOM:
                            playerCards.removeAll(cards);
                            context.put(playerName, Context.ContextKind.PLAYERCARDS, playerCards);
                            break;
                        case GET:
                            playerCards.addAll(cards);
                            context.put(playerName, Context.ContextKind.PLAYERCARDS, playerCards);
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
