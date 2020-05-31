package beetle.brindi.cards.service;

import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOhandResponse;
import beetle.brindi.cards.dto.DTOplayHandResponse;
import beetle.brindi.cards.dto.DTOplayRequest;
import beetle.brindi.cards.dto.DTOplayResponse;
import beetle.brindi.cards.dto.DTOsignupRequest;
import beetle.brindi.cards.dto.TypeResponse;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.repository.CardsRepository;
import lombok.RequiredArgsConstructor;
import org.javatuples.Pair;
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
        Pair<List<DTOcard>, List<DTOcard>> cardsCards = null;
        switch (typeRequest) {
            case PUT_ON_TABLE:
                cardsCards = putCardsOnTable(gameUuid, playerUuid, tablePosition, cards);
                playResponse =
                        DTOplayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.PUT_ON_TABLE)
                                .tablePosition(tablePosition)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(cardsCards.getValue1())
                                .typeResponse(TypeResponse.PUT_ON_TABLE)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case PUT_ON_STACK_BOTTOM:
                cardsCards = putCards(gameUuid, playerUuid, cards);
                playResponse =
                        DTOplayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.PUT_ON_STACK_BOTTOM)
                                .tablePosition(tablePosition)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(cardsCards.getValue1())
                                .typeResponse(TypeResponse.PUT_ON_STACK_BOTTOM)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case SLIDE_ON_TABLE:
                cardsCards = putCardsOnTable(gameUuid, playerUuid, tablePosition, cards);
                playResponse =
                        DTOplayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.SLIDE_ON_TABLE)
                                .tablePosition(tablePosition)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(cardsCards.getValue1())
                                .typeResponse(TypeResponse.SLIDE_ON_TABLE)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case DEAL:
                cardsCards = deal(gameUuid, playerUuid);
                playResponse =
                        DTOplayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.DEAL)
                                .tablePosition(0)

                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(cardsCards.getValue1())
                                .typeResponse(TypeResponse.DEAL)

                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case GET_FROM_STACK_BOTTOM:
               cardsCards = getCard(gameUuid, playerUuid);
                playResponse =
                        DTOplayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.GET)
                                .tablePosition(0)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(cardsCards.getValue1())
                                .typeResponse(TypeResponse.GET)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            case GET_FROM_STACK_TOP:
                cardsCards = drawCard(gameUuid, playerUuid);
                playResponse =
                        DTOplayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.GET)
                                .tablePosition(0)
                                .build()
                ;
                handResponse =
                        DTOhandResponse.builder()
                                .cards(cardsCards.getValue1())
                                .typeResponse(TypeResponse.GET)
                                .handPosition(handPosition)
                                .build()
                ;
                return new DTOplayHandResponse(playResponse, handResponse);

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Undefined typeRequest : " + typeRequest);
        }
    }

    public DTOplayResponse startGame(DTOsignupRequest signupRequest) {
        UUID gameUuid = signupRequest.getGameUuid();
        UUID playerUuid = signupRequest.getPlayerUuid();
        DTOsignupRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        switch (typeRequest) {
            case START:
                startGame(gameUuid);
                return DTOplayResponse.builder()
                    .typeResponse(TypeResponse.START)
                    .build();

            default:
                return null;
        }
    }

    public Pair<List<DTOcard>, List<DTOcard>> deal (UUID gameUuid, UUID playerUuid ){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        return convert2DTO( game.dealCards(playerUuid, 13) );
    }

    private Pair<List<DTOcard>, List<DTOcard>> drawCard (UUID gameUuid, UUID playerUuid){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        return convert2DTO( game.drawCard(playerUuid) );
    }

    private Pair<List<DTOcard>, List<DTOcard>> getCard (UUID gameUuid, UUID playerUuid){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        return convert2DTO( game.getCard(playerUuid) );
    }

    private Pair<List<DTOcard>, List<DTOcard>> putCards (UUID gameUuid, UUID playerUuid, List<Card> cards){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        return convert2DTO(game.putCards(playerUuid, cards));
    }

    private Pair<List<DTOcard>, List<DTOcard>> putCardsOnTable (UUID gameUuid, UUID playerUuid, Integer place, List<Card> cards){
        Game game = serviceHelper.getGame(gameUuid);
        Player player = serviceHelper.getPlayer(game, playerUuid);

        return convert2DTO(game.putCardsOnTable(playerUuid, place, cards));
    }

    private Card.Back getTopOfStock(UUID gameUuid) {
        Game game = serviceHelper.getGame(gameUuid);
        return game.getTopOfStock();
    }
    private DTOcard getBottomOfStock(UUID gameUuid) {
        Game game = serviceHelper.getGame(gameUuid);
        return new DTOcard( game.getBottomOfStock() );
    }

    private Pair<List<DTOcard>, List<DTOcard>>convert2DTO(Pair<List<Card>, List<Card>> cards) {
        return Pair.with(
                cards.getValue0().stream().map(DTOcard::new).collect(Collectors.toList())
                , cards.getValue1().stream().map(DTOcard::new).collect(Collectors.toList())
        );
    }

    private void startGame(UUID gameUuid) {
        Game game = serviceHelper.getGame(gameUuid);
        game.setStarted(Boolean.TRUE);
    }

}