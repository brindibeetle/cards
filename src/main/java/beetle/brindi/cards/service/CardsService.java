package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.DeckBuilder;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.domain.Players;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOplay;
import beetle.brindi.cards.dto.DTOputCard;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.repository.CardsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardsService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final CardsRepository cardsRepository;

    public DTOgame createGame(String playerName) {

        UUID gameUUID = UUID.randomUUID();

        Deck deck = new DeckBuilder()
                .addAllRanks()
                .addAllSuits()
                .addAllBacks()
                .addRegulars()
                .addAllSpecialTypes()
                .addSpecials()
                .shuffle()
                .build();

        Game game = new Game(deck);
        game.addPlayer(playerName);
        CardsSingleton.getInstance().getGames().getGames().put(gameUUID, game);

        return new DTOgame( gameUUID, game );
    }

    private Game getGame (UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Game game = singleton.getGames().get( gameUuid );
        if ( game == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "Game not found");
        }
        return game;
    }
    private Player getPlayer (Game game, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Player player = game.getPlayers().get( playerUuid );
        if ( player == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "player not found");
        }
        return player;
    }


    public DTOplay play(DTOplay dtoPlay) {
        UUID gameUuid = dtoPlay.getGameUuid();
        UUID playerUuid = dtoPlay.getPlayerUuid();
        int numberOfCards = dtoPlay.getNumberOfCards();
        List<Card> cards = dtoPlay.getCards().stream().map(Card::new).collect(Collectors.toList());

        switch (dtoPlay.getAction()) {
            case TABLE:
                dtoPlay =
                    DTOplay.builder()
                        .cards(putCardsOnTable (gameUuid, playerUuid, numberOfCards, cards ))
                        .playerUuid(playerUuid)
                        .gameUuid(gameUuid)
                        .bottomCard(getBottomOfStock(gameUuid))
                        .topCardBack(getTopOfStock(gameUuid).toString())
                        .action(DTOplay.Action.TABLE)
                        .numberOfCards(numberOfCards)
                        .build()
                ;
                return dtoPlay;

            case DEAL:
                dtoPlay =
                    DTOplay.builder()
                        .cards(deal (gameUuid, playerUuid, numberOfCards))
                        .playerUuid(playerUuid)
                        .gameUuid(gameUuid)
                        .bottomCard(getBottomOfStock(gameUuid))
                        .topCardBack(getTopOfStock(gameUuid).toString())
                        .action(DTOplay.Action.DEAL)
                        .numberOfCards(0)
                        .build()
                    ;
                return dtoPlay;

            case GET:
                dtoPlay =
                    DTOplay.builder()
                        .cards(getCard (gameUuid, playerUuid))
                        .playerUuid(playerUuid)
                        .gameUuid(gameUuid)
                        .bottomCard(getBottomOfStock(gameUuid))
                        .topCardBack(getTopOfStock(gameUuid).toString())
                        .action(DTOplay.Action.GET)
                        .numberOfCards(numberOfCards)
                        .build()
                ;
                return dtoPlay;

            case DRAW:
                dtoPlay =
                    DTOplay.builder()
                        .cards(drawCard (gameUuid, playerUuid))
                        .playerUuid(playerUuid)
                        .gameUuid(gameUuid)
                        .bottomCard(getBottomOfStock(gameUuid))
                        .topCardBack(getTopOfStock(gameUuid).toString())
                        .action(DTOplay.Action.DRAW)
                        .numberOfCards(numberOfCards)
                        .build()
                ;
                return dtoPlay;

            case PUT:
                dtoPlay =
                    DTOplay.builder()
                        .cards(putCard (gameUuid, playerUuid,cards))
                        .playerUuid(playerUuid)
                        .gameUuid(gameUuid)
                        .bottomCard(getBottomOfStock(gameUuid))
                        .topCardBack(getTopOfStock(gameUuid).toString())
                        .action(DTOplay.Action.PUT)
                        .numberOfCards(numberOfCards)
                        .build()
                ;
                return dtoPlay;

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Undefined ACTION : " + dtoPlay.getAction());
        }
    }

    public List<DTOcard> deal (UUID gameUuid, UUID playerUuid, int numberOfCards){
        Game game = getGame(gameUuid);
        Player player = getPlayer(game, playerUuid);

        List<Card> cards = game.dealCards(playerUuid, numberOfCards);

        return cards.stream()
            .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private List<DTOcard> drawCard (UUID gameUuid, UUID playerUuid){
        Game game = getGame(gameUuid);
        Player player = getPlayer(game, playerUuid);

        List<Card> cards = game.drawCard(playerUuid);

        return cards.stream()
                .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private List<DTOcard> getCard (UUID gameUuid, UUID playerUuid){
        Game game = getGame(gameUuid);
        Player player = getPlayer(game, playerUuid);

        List<Card> cards = game.getCard(playerUuid);

        return cards.stream()
                .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private List<DTOcard> putCard (UUID gameUuid, UUID playerUuid, List<Card> cards){
        Game game = getGame(gameUuid);
        Player player = getPlayer(game, playerUuid);

        game.putCards(playerUuid, cards);

        return new ArrayList<>();
    }

    private List<DTOcard> putCardsOnTable (UUID gameUuid, UUID playerUuid, Integer place, List<Card> cards){
        Game game = getGame(gameUuid);
        Player player = getPlayer(game, playerUuid);

        return game.putCardsOnTable(playerUuid, place, cards)
                .stream()
                .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private Card.Back getTopOfStock(UUID gameUuid) {
        Game game = getGame(gameUuid);
        return game.getTopOfStock();
    }
    private DTOcard getBottomOfStock(UUID gameUuid) {
        Game game = getGame(gameUuid);
        return new DTOcard( game.getBottomOfStock() );
    }


}