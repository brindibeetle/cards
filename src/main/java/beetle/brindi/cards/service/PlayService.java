package beetle.brindi.cards.service;

import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOhandResponse;
import beetle.brindi.cards.dto.DTOplayHandResponse;
import beetle.brindi.cards.dto.DTOplayRequest;
import beetle.brindi.cards.dto.DTOplayResponse;
import beetle.brindi.cards.dto.TypeResponse;
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
public class PlayService {

    private final ServiceHelper serviceHelper;

    private final CardsRepository cardsRepository;

    public DTOplayHandResponse play(DTOplayRequest playRequest) {
        UUID gameUuid = playRequest.getGameUuid();
        UUID playerUuid = playRequest.getPlayerUuid();
        DTOplayRequest.TypeRequest typeRequest = playRequest.getTypeRequest();
        List<Card> cards = playRequest.getCards().stream().map(Card::new).collect(Collectors.toList());
        int handPosition = playRequest.getHandPosition();
        int tablePosition = playRequest.getTablePosition();

        DTOplayResponse playResponse = null;
        DTOhandResponse handResponse = null;
        switch (typeRequest) {
            case PUT_ON_TABLE:
                playResponse =
                        DTOplayResponse.builder()
                                .cards(putCardsOnTable (gameUuid, playerUuid, tablePosition, cards ))
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.PUT_ON_TABLE)
                                .tablePosition(tablePosition)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(putCardsOnTable (gameUuid, playerUuid, tablePosition, cards ))
                                .typeResponse(TypeResponse.PUT_ON_TABLE)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case PUT_ON_STACK_BOTTOM:
                playResponse =
                        DTOplayResponse.builder()
                                .cards(putCards(gameUuid, playerUuid, cards ))
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.PUT_ON_STACK_BOTTOM)
                                .tablePosition(tablePosition)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(putCards(gameUuid, playerUuid, cards ))
                                .typeResponse(TypeResponse.PUT_ON_STACK_BOTTOM)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case SLIDE_ON_TABLE:
                playResponse =
                        DTOplayResponse.builder()
                                .cards(putCardsOnTable (gameUuid, playerUuid, tablePosition, cards ))
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.SLIDE_ON_TABLE)
                                .tablePosition(tablePosition)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(putCardsOnTable (gameUuid, playerUuid, tablePosition, cards ))
                                .typeResponse(TypeResponse.SLIDE_ON_TABLE)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case DEAL:
                playResponse =
                        DTOplayResponse.builder()
                                .cards(deal (gameUuid, playerUuid ))
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.DEAL)
                                .tablePosition(0)

                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(deal (gameUuid, playerUuid ))
                                .typeResponse(TypeResponse.DEAL)

                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case GET_FROM_STACK_BOTTOM:
                playResponse =
                        DTOplayResponse.builder()
                                .cards(getCard (gameUuid, playerUuid))
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.GET)
                                .tablePosition(0)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(getCard (gameUuid, playerUuid))
                                .typeResponse(TypeResponse.GET)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case GET_FROM_STACK_TOP:
                playResponse =
                        DTOplayResponse.builder()
                                .cards(drawCard(gameUuid, playerUuid))
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.GET)
                                .tablePosition(0)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(drawCard(gameUuid, playerUuid))
                                .typeResponse(TypeResponse.GET)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Undefined typeRequest : " + typeRequest);
        }
    }

    public List<DTOcard> deal (UUID gameUuid, UUID playerUuid ){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        List<Card> cards = game.dealCards(playerUuid, 13);

        return cards.stream()
            .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private List<DTOcard> drawCard (UUID gameUuid, UUID playerUuid){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        List<Card> cards = game.drawCard(playerUuid);

        return cards.stream()
                .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private List<DTOcard> getCard (UUID gameUuid, UUID playerUuid){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        List<Card> cards = game.getCard(playerUuid);

        return cards.stream()
                .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private List<DTOcard> putCards (UUID gameUuid, UUID playerUuid, List<Card> cards){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        game.putCards(playerUuid, cards);

        return new ArrayList<>();
    }

    private List<DTOcard> putCardsOnTable (UUID gameUuid, UUID playerUuid, Integer place, List<Card> cards){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        return game.putCardsOnTable(playerUuid, place, cards)
                .stream()
                .map(DTOcard::new)
                .collect(Collectors.toList());
    }

    private Card.Back getTopOfStock(UUID gameUuid) {
        Game game = serviceHelper.getGame(gameUuid);
        return game.getTopOfStock();
    }
    private DTOcard getBottomOfStock(UUID gameUuid) {
        Game game = serviceHelper.getGame(gameUuid);
        return new DTOcard( game.getBottomOfStock() );
    }


}