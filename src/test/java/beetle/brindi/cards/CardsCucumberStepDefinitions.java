package beetle.brindi.cards;

import beetle.brindi.cards.controller.PlayController;
import beetle.brindi.cards.controller.SigningUpController;
import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.domain.Context;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.Game;
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
import beetle.brindi.cards.service.PlayService;
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
import java.util.Map;
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

    @Autowired
    protected PlayService playService;

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
            context.put("", Context.ContextKind.TABLE, new ArrayList<>());
        });

        And("the dealer gives the following cards:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<Card> cards = new ArrayList<>();
            data.forEach(row -> cards.add(new Card(row.get(0), row.get(1), row.get(2), row.get(3))));

            String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
            String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);
            UUID gameUuid = ((DTOgame)context.get(gameName, Context.ContextKind.GAME)).getGameUuid();

            context.put(playerName, Context.ContextKind.PLAYERCARDS, new ArrayList<>());

            doPlayRequest(PlayRequest.TypeRequest.GET_FROM_STACK, getNewCardsFromDeck(gameUuid, cards));
        });

        Then("the player should hold the following cards:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<Card> cardsExpected = new ArrayList<>();
            data.forEach(row -> cardsExpected.add(new Card(row.get(0), row.get(1), row.get(2), row.get(3))));
            List<DTOcard> cardsExpectedDTO = lookupCards(cardsExpected);

            String playerName = (String)context.get("", Context.ContextKind.CURRENTPLAYER);
            List<DTOcard>cardsActual = (List<DTOcard>)context.get(playerName, Context.ContextKind.PLAYERCARDS);

            Assert.assertArrayEquals("handcards dont match", cardsExpectedDTO.toArray(), cardsActual.toArray() );
        });

        And("the player takes card {word} of {word} with {word} back from stock", (String rank, String suit, String back) -> {
            Card card = new Card(suit, rank, "",back);

            String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);
            UUID gameUuid = ((DTOgame)context.get(gameName, Context.ContextKind.GAME)).getGameUuid();

            List<Card> cards = new ArrayList<>();
            cards.add(card);

            doPlayRequest(PlayRequest.TypeRequest.GET_FROM_STACK, getNewCardsFromDeck(gameUuid, cards));
        });

        And("the player takes card {word} with {word} back from stock", (String specialType, String back) -> {
            Card card = new Card("", "", specialType,"");

            String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);
            UUID gameUuid = ((DTOgame)context.get(gameName, Context.ContextKind.GAME)).getGameUuid();

            List<Card> cards = new ArrayList<>();
            cards.add(card);

            doPlayRequest(PlayRequest.TypeRequest.GET_FROM_STACK_TOP, getNewCardsFromDeck(gameUuid, cards));
        });

        And("the player lays the following cards on the table:", (DataTable dataTable) -> {

            List<List<String>> data = dataTable.asLists(String.class);
            List<Card> cards = new ArrayList<>();
            data.forEach(row -> cards.add(new Card(row.get(0), row.get(1), row.get(2), row.get(3))));

            doPlayRequest(PlayRequest.TypeRequest.PUT_ON_TABLE, lookupCards(cards));
        });
        And("the player puts the card {word} of {word} with {word} back on bottom of stock", (String rank, String suit, String back) -> {
            Card card = new Card(suit, rank, "",back);

            List<DTOcard> cards = new ArrayList<>();
            cards.add(lookupCard(card));

            doPlayRequest(PlayRequest.TypeRequest.PUT_ON_STACK_BOTTOM, cards);
        });
        And("the player requests to get dealt", () -> {
            doPlayRequest(PlayRequest.TypeRequest.DEAL, new ArrayList<>());
        });

        Then("the player {word} should have {int} cards in his/her hands", (String playerName, Integer numberOfCards) -> {

            List<DTOcard>cards = (List<DTOcard>)context.get(playerName, Context.ContextKind.PLAYERCARDS);

            Assert.assertTrue( "hand should hold number of cards", numberOfCards == cards.size() );
        });

        Then("the player {word} should be finished", (String playerName) -> {

            DTOplayer player = (DTOplayer)context.get(playerName, Context.ContextKind.PLAYER);

            Assert.assertEquals( "player should be finished", Player.Status.FINISHED, player.getPlayerStatus() );
        });

        Then("the deck should hold {long} cards of suit {word}", (Long number, String suit) -> {
            String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);
            UUID gameUuid = ((DTOgame)context.get(gameName, Context.ContextKind.GAME)).getGameUuid();
            Assert.assertEquals("the deck is not consistent", number , playService.getNumberOfCards(gameUuid, suit, "", "", ""));
        });

        Then("the deck should hold {long} cards of specialType {word}", (Long number, String specialType) -> {
            String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);
            UUID gameUuid = ((DTOgame)context.get(gameName, Context.ContextKind.GAME)).getGameUuid();
            Assert.assertEquals("the deck is not consistent", number , playService.getNumberOfCards(gameUuid, "", "", "", specialType));
        });

        Then("the deck should hold {long} cards", (Long number) -> {
            String gameName = (String)context.get("", Context.ContextKind.CURRENTGAME);
            UUID gameUuid = ((DTOgame)context.get(gameName, Context.ContextKind.GAME)).getGameUuid();
            Assert.assertEquals("the deck is not consistent", number , playService.getNumberOfCards(gameUuid, "", "", "", ""));
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
                .cardUUIDs(cards.stream().map(DTOcard::getUuid).collect(Collectors.toList()))
                .build();

        PlayingResponse playingResponse = playController.play(playRequest);
        playingResponse.getGameResponse().ifPresent(
                gameResponse -> {
                    switch (gameResponse.getTypeResponse()) {
                        case GAME:
                            context.putList(Context.ContextKind.PLAYER, gameResponse.getPlayers(), DTOplayer::getPlayerName);
//                            context.put("", Context.ContextKind.CURRENTPLAYER, gameResponse.getCurrentPlayer().getPlayerName());
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
                            List<DTOcard> addTableCards = playResponse.getCards();
                            if (addTableCards.size() > 0)
                                tableCards.add(playResponse.getTablePosition(), addTableCards);
                            context.put("", Context.ContextKind.TABLE, tableCards);
                            context.put( "", Context.ContextKind.TOPCARDBACK, playResponse.getTopCardBack());
                            context.put("", Context.ContextKind.BOTTOMCARD, playResponse.getBottomCard());
                            break;
                        case SLIDE_ON_TABLE:
                            tableCards = (List<List<DTOcard>>)context.get("", Context.ContextKind.TABLE);
                            addTableCards = playResponse.getCards();
                            if (addTableCards.size() > 0)
                                tableCards.add(playResponse.getTablePosition(), addTableCards);
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


    private List<DTOcard> getNewCardsFromDeck(UUID gameUUID, List<Card> cards){
        Game game = CardsSingleton.getInstance().getGames().get(gameUUID);
        Deck deck = game.getDeck();
        List<DTOcard> result = new ArrayList<>();
        List<DTOcard> knownCards = getKnownCards();
        List<UUID> notThese = knownCards.stream().map(DTOcard::getUuid).collect(Collectors.toList());

        cards.forEach(card -> {
                UUID cardUUID = deck.getUUIDfromCard(card, notThese);
                result.add(new DTOcard(cardUUID, card));
            });

        return result;
    }

    private List<DTOcard> lookupCards(List<Card> cards) {
        List<DTOcard> knownCards = getKnownCards();

        Map<Card, UUID> knownCardsMap = knownCards.stream().collect(Collectors.toMap(Card::new, DTOcard::getUuid));

        List<DTOcard> dtoCards = cards.stream().map(card -> {
            UUID uuid = knownCardsMap.get(card);
            if (uuid == null)
                throw new CardsException(HttpStatus.CONFLICT, "Card not found in knowncards, card : " + card);
            return new DTOcard(uuid, card);
        }).collect(Collectors.toList());

        return dtoCards;
    }

    private DTOcard lookupCard(Card card) {
        List<DTOcard> knownCards = getKnownCards();

        Map<Card, UUID> knownCardsMap = knownCards.stream().collect(Collectors.toMap(Card::new, DTOcard::getUuid));

        UUID uuid = knownCardsMap.get(card);
        if (uuid == null)
            throw new CardsException(HttpStatus.CONFLICT, "Card not found in knowncards, card : " + card);

        return new DTOcard(uuid, card);
    }

    private List<DTOcard> getKnownCards () {
        List<DTOcard> knownCards = new ArrayList<>();
        List<List<DTOcard>> tableCards = (List<List<DTOcard>>)context.get("", Context.ContextKind.TABLE);
        tableCards.forEach(tCards -> knownCards.addAll(tCards));

        List<DTOcard>playerCards = context.getAllOfKindList(Context.ContextKind.PLAYERCARDS, DTOcard.class);
        knownCards.addAll(playerCards);
        return knownCards;
    }

//    private List<UUID> allKnownCards() {
//        List<DTOcard> cards =
//                context.getAllOfKindList(Context.ContextKind.PLAYERCARDS, DTOcard.class )
//                .addAll()
//
//        return cards.stream().map(DTOcard::getUuid).collect(Collectors.toList());
//    }
}
