package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.DeckBuilder;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Games;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.domain.Players;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOcardsRequest;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOhandResponse;
import beetle.brindi.cards.dto.DTOplay;
import beetle.brindi.cards.dto.DTOplayerIdentifierRequest;
import beetle.brindi.cards.dto.DTOputCard;
import beetle.brindi.cards.dto.Place;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.repository.CardsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardsService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final CardsRepository cardsRepository;

    public DTOgame createGame(DTOplayerIdentifierRequest playerIdentifier) {

        UUID gameUUID = UUID.randomUUID();

        Deck deck = new DeckBuilder()
                .addAllRanks()
                .addAllSuits()
                .addAllBacks()
                .addRegulars()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addSpecials()
                .shuffle()
                .build();

        Game game = new Game(deck);

        UUID playerUuid =  playerIdentifier.getPlayerUuid();
        game.addPlayer(playerIdentifier.getPlayerName(), playerUuid);
        game.setCreator(playerUuid);

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

    public List<DTOgame> getGames () {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Map<UUID, Game> games = singleton.getGames().getGames();

        List<DTOgame> dtoGames = new ArrayList<>();
        games.entrySet().stream().forEach(e -> dtoGames.add(new DTOgame( e.getKey(), e.getValue()) ));

        return dtoGames;
    }

    private Player getPlayer (Game game, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Player player = game.getPlayers().get( playerUuid );
        if ( player == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "player not found");
        }
        return player;
    }


    public DTOhandResponse play(DTOcardsRequest cardsRequest) {
        UUID gameUuid = cardsRequest.getGameUuid();
        UUID playerUuid = cardsRequest.getPlayerUuid();
        DTOcardsRequest.TypeRequest typeRequest = cardsRequest.getTypeRequest();
        List<Card> cards = cardsRequest.getCards().stream().map(Card::new).collect(Collectors.toList());
        int handPosition = cardsRequest.getHandPosition();
        int tablePosition = cardsRequest.getTablePosition();
        Place place = cardsRequest.getPlace();

        DTOhandResponse handResponse = null;
        switch (typeRequest) {
            case PUT:
                switch (place) {
                    case TABLE:
                        handResponse =
                                DTOhandResponse.builder()
                                        .cards(putCardsOnTable (gameUuid, playerUuid, tablePosition, cards ))
                                        .bottomCard(getBottomOfStock(gameUuid))
                                        .topCardBack(getTopOfStock(gameUuid).toString())
                                        .typeResponse(DTOhandResponse.TypeResponse.PUT)
                                        .handPosition(handPosition)
                                        .tablePosition(tablePosition)
                                        .place(place)
                                        .build()
                        ;
                        return handResponse;
                    case STACKBOTTOM:
                        handResponse =
                                DTOhandResponse.builder()
                                        .cards(putCards(gameUuid, playerUuid, cards ))
                                        .bottomCard(getBottomOfStock(gameUuid))
                                        .topCardBack(getTopOfStock(gameUuid).toString())
                                        .typeResponse(DTOhandResponse.TypeResponse.PUT)
                                        .handPosition(handPosition)
                                        .tablePosition(tablePosition)
                                        .place(place)
                                        .build()
                        ;
                        return handResponse;
                }

            case SLIDE:
                handResponse =
                        DTOhandResponse.builder()
                                .cards(putCardsOnTable (gameUuid, playerUuid, tablePosition, cards ))
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(DTOhandResponse.TypeResponse.SLIDE)
                                .handPosition(handPosition)
                                .tablePosition(tablePosition)
                                .place(place)
                                .build()
                ;
                return handResponse;

            case DEAL:
                handResponse =
                        DTOhandResponse.builder()
                        .cards(deal (gameUuid, playerUuid ))
                        .bottomCard(getBottomOfStock(gameUuid))
                        .topCardBack(getTopOfStock(gameUuid).toString())
                        .typeResponse(DTOhandResponse.TypeResponse.DEAL)
                        .handPosition(0)
                        .tablePosition(0)
                        .place(place)

                        .build()
                    ;
                return handResponse;

            case GET:
                switch (place) {
                    case STACKBOTTOM:
                        handResponse =
                                DTOhandResponse.builder()
                                        .cards(getCard (gameUuid, playerUuid))
                                        .bottomCard(getBottomOfStock(gameUuid))
                                        .topCardBack(getTopOfStock(gameUuid).toString())
                                        .typeResponse(DTOhandResponse.TypeResponse.GET)
                                        .handPosition(handPosition)
                                        .tablePosition(0)
                                        .place(place)
                                        .build()
                        ;
                        return handResponse;

                    case STACKTOP:
                        handResponse =
                                DTOhandResponse.builder()
                                        .cards(drawCard(gameUuid, playerUuid))
                                        .bottomCard(getBottomOfStock(gameUuid))
                                        .topCardBack(getTopOfStock(gameUuid).toString())
                                        .typeResponse(DTOhandResponse.TypeResponse.GET)
                                        .handPosition(handPosition)
                                        .tablePosition(0)
                                        .place(place)
                                        .build()
                        ;
                        return handResponse;
                }

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Undefined typeRequest : " + typeRequest);
        }
    }

    public List<DTOcard> deal (UUID gameUuid, UUID playerUuid ){
        Game game = getGame(gameUuid);
        Player player = getPlayer(game, playerUuid);

        List<Card> cards = game.dealCards(playerUuid, 13);

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

    private List<DTOcard> putCards (UUID gameUuid, UUID playerUuid, List<Card> cards){
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