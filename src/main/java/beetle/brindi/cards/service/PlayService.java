package beetle.brindi.cards.service;

import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOplayer;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.request.PlayRequest;
import beetle.brindi.cards.request.SigningUpRequest;
import beetle.brindi.cards.response.GameResponse;
import beetle.brindi.cards.response.HandResponse;
import beetle.brindi.cards.response.PlayResponse;
import beetle.brindi.cards.response.PlayingResponse;
import beetle.brindi.cards.response.TypeResponse;
import lombok.RequiredArgsConstructor;
import org.javatuples.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayService {

    private final GamesService gamesService;

    private final PlayersService playersService;

    public PlayingResponse play(PlayRequest playRequest) {
        UUID gameUuid = playRequest.getGameUuid();
        UUID playerUuid = playRequest.getPlayerUuid();
        PlayRequest.TypeRequest typeRequest = playRequest.getTypeRequest();
        List<UUID> cardUUIDs = playRequest.getCardUUIDs();
        int handPosition = playRequest.getHandPosition();
        int tablePosition = playRequest.getTablePosition();

        Optional<PlayResponse> playResponse = Optional.empty();
        Optional<HandResponse> handResponse = Optional.empty();
        Optional<GameResponse> gameResponse = Optional.empty();
        Pair<List<DTOcard>, List<DTOcard>> cardsCards = null;

        Map<UUID,Player> pipo = playersService.getPlayers(gameUuid);

        switch (typeRequest) {
            case PUT_ON_TABLE:
                int tablePosition1 = getNextTablePosition(gameUuid);
                cardsCards = putCardsOnTable(gameUuid, playerUuid, tablePosition1, cardUUIDs);
                playResponse =
                        Optional.of(
                                PlayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.PUT_ON_TABLE)
                                .tablePosition(tablePosition1)
                                .build()
                        );
                handResponse =
                        Optional.of(
                            HandResponse.builder()
                                .cards(getPlayersHand(gameUuid, playerUuid))
                                .typeResponse(TypeResponse.PUT_ON_TABLE)
                                .handPosition(handPosition)
                                .build()
                        );
                gameResponse = Optional.empty();
                return new PlayingResponse(playResponse, handResponse, gameResponse);

            case PUT_ON_STACK_BOTTOM:
                cardsCards = putCards(gameUuid, playerUuid, cardUUIDs);
                playersService.isPlayerFinished(gameUuid, playerUuid);
                DTOplayer nextPlayer = playersService.nextPlayer(gameUuid);
                String currentPlayerUuid = "";
                if ( nextPlayer != null )
                    currentPlayerUuid = nextPlayer.getPlayerUuid().toString();
                playResponse =
                        Optional.of(
                            PlayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.PUT_ON_STACK_BOTTOM)
                                .tablePosition(tablePosition)
                                .build()
                        );
                handResponse =
                        Optional.of(
                            HandResponse.builder()
                                .cards(getPlayersHand(gameUuid, playerUuid))
                                .typeResponse(TypeResponse.PUT_ON_STACK_BOTTOM)
                                .handPosition(handPosition)
                                .build()
                        );
                gameResponse =
                        Optional.of(
                            GameResponse.builder()
                                .typeResponse(GameResponse.TypeResponse.GAME)
                                .players(
                                        playersService.getPlayers(gameUuid).entrySet().stream()
                                                .map( uuidPlayerEntry -> new DTOplayer( uuidPlayerEntry.getKey(), uuidPlayerEntry.getValue()))
                                                .collect(Collectors.toList())
                                )
                                .currentPlayerUuid( currentPlayerUuid)
                                .phase(GameResponse.Phase.DRAW)
                                .build()
                        );
                return new PlayingResponse(playResponse, handResponse, gameResponse);

            case SLIDE_ON_TABLE:
                cardsCards = putCardsOnTable(gameUuid, playerUuid, tablePosition, cardUUIDs);
                playResponse =
                        Optional.of(
                            PlayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.SLIDE_ON_TABLE)
                                .tablePosition(tablePosition)
                                .build()
                        );
                handResponse =
                        Optional.of(
                            HandResponse.builder()
                                .cards(getPlayersHand(gameUuid, playerUuid))
                                .typeResponse(TypeResponse.SLIDE_ON_TABLE)
                                .handPosition(handPosition)
                                .build()
                        );
                gameResponse = Optional.empty();
                return new PlayingResponse(playResponse, handResponse, gameResponse);

            case DEAL:
                cardsCards = deal(gameUuid, playerUuid);
                playResponse =
                        Optional.of(
                            PlayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.DEAL)
                                .tablePosition(0)

                                .build()
                        );
                handResponse =
                        Optional.of(
                            HandResponse.builder()
                                .cards(getPlayersHand(gameUuid, playerUuid))
                                .typeResponse(TypeResponse.DEAL)
                               .build()
                        );
                gameResponse =
                        Optional.of(
                            GameResponse.builder()
                                .typeResponse(GameResponse.TypeResponse.GAME)
                                .players(
                                        playersService.getPlayers(gameUuid).entrySet().stream()
                                                .map( uuidPlayerEntry -> new DTOplayer( uuidPlayerEntry.getKey(), uuidPlayerEntry.getValue()))
                                                .collect(Collectors.toList())
                                )
                                .currentPlayerUuid( playersService.currentPlayer(gameUuid).getPlayerUuid().toString())
                                .phase(GameResponse.Phase.DRAW)
                                .build()
                        );
                return new PlayingResponse(playResponse, handResponse, gameResponse);

            case GET_FROM_STACK_BOTTOM:
                cardsCards = getCard(gameUuid, playerUuid);
                playResponse =
                        Optional.of(
                            PlayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.GET)
                                .tablePosition(0)
                                .build()
                        );
                handResponse =
                        Optional.of(
                            HandResponse.builder()
                                .cards(getPlayersHand(gameUuid, playerUuid))
                                .typeResponse(TypeResponse.GET)
                                .handPosition(handPosition)
                                .build()
                        );
                gameResponse =
                        Optional.of(
                            GameResponse.builder()
                                .typeResponse(GameResponse.TypeResponse.GAME)
                                .players(
                                        playersService.getPlayers(gameUuid).entrySet().stream()
                                                .map( uuidPlayerEntry -> new DTOplayer( uuidPlayerEntry.getKey(), uuidPlayerEntry.getValue()))
                                                .collect(Collectors.toList())
                                )
                                .currentPlayerUuid( playersService.currentPlayer(gameUuid).getPlayerUuid().toString())
                                .phase(GameResponse.Phase.PUT)
                                .build()
                        );
                return new PlayingResponse(playResponse, handResponse, gameResponse);

            case GET_FROM_STACK_TOP:
                cardsCards = drawCard(gameUuid, playerUuid);
                playResponse =
                        Optional.of(
                            PlayResponse.builder()
                                .cards(cardsCards.getValue0())
                                .bottomCard(getBottomOfStock(gameUuid))
                                .topCardBack(getTopOfStock(gameUuid).toString())
                                .typeResponse(TypeResponse.GET)
                                .tablePosition(0)
                                .build()
                        );
                handResponse =
                        Optional.of(
                            HandResponse.builder()
                                .cards(getPlayersHand(gameUuid, playerUuid))
                                .typeResponse(TypeResponse.GET)
                                .handPosition(handPosition)
                                .build()
                        );
                gameResponse =
                        Optional.of(
                            GameResponse.builder()
                                .typeResponse(GameResponse.TypeResponse.GAME)
                                .players(
                                        playersService.getPlayers(gameUuid).entrySet().stream()
                                                .map( uuidPlayerEntry -> new DTOplayer( uuidPlayerEntry.getKey(), uuidPlayerEntry.getValue()))
                                                .collect(Collectors.toList())
                                )
                                .currentPlayerUuid( playersService.currentPlayer(gameUuid).getPlayerUuid().toString())
                                .phase(GameResponse.Phase.PUT)
                                .build()
                        );
                return new PlayingResponse(playResponse, handResponse, gameResponse);

            case GET_FROM_STACK:
                cardsCards = holds(gameUuid, playerUuid, cardUUIDs);
                playResponse =
                        Optional.of(
                                PlayResponse.builder()
                                        .cards(cardsCards.getValue0())
                                        .bottomCard(getBottomOfStock(gameUuid))
                                        .topCardBack(getTopOfStock(gameUuid).toString())
                                        .typeResponse(TypeResponse.GET)
                                        .tablePosition(0)

                                        .build()
                        );
                handResponse =
                        Optional.of(
                                HandResponse.builder()
                                        .cards(getPlayersHand(gameUuid, playerUuid))
                                        .typeResponse(TypeResponse.GET)
                                        .build()
                        );
                gameResponse =
                        Optional.of(
                                GameResponse.builder()
                                        .typeResponse(GameResponse.TypeResponse.GAME)
                                        .players(
                                                playersService.getPlayers(gameUuid).entrySet().stream()
                                                        .map( uuidPlayerEntry -> new DTOplayer( uuidPlayerEntry.getKey(), uuidPlayerEntry.getValue()))
                                                        .collect(Collectors.toList())
                                        )
                                        .currentPlayerUuid( playersService.currentPlayer(gameUuid).getPlayerUuid().toString())
                                        .phase(GameResponse.Phase.DRAW)
                                        .build()
                        );
                return new PlayingResponse(playResponse, handResponse, gameResponse);

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Undefined typeRequest : " + typeRequest);
        }
    }

    public Optional<PlayResponse> startGame(SigningUpRequest signupRequest) {
        UUID gameUuid = signupRequest.getGameUuid();
        UUID playerUuid = signupRequest.getPlayerUuid();
        SigningUpRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        switch (typeRequest) {
            case START:
                startGame(gameUuid);
                return Optional.of(
                    PlayResponse.builder()
                        .typeResponse(TypeResponse.START)
                        .build()
                );

            default:
                return Optional.empty();
        }
    }

    public synchronized Pair<List<DTOcard>, List<DTOcard>> deal (UUID gameUuid, UUID playerUuid ){
        Game game = gamesService.getGame(gameUuid);
        return convert2DTO(gameUuid, game.dealCards(playerUuid, 13) );
    }

    // only for testing purposes
    public Long getNumberOfCards(UUID gameUuid, String suit, String rank, String back, String specialType){
        Game game = gamesService.getGame(gameUuid);
        return game.getDeck().getNumberOfCards(suit, rank, back, specialType);
    }

    // only for testing
    private Pair<List<DTOcard>, List<DTOcard>> holds(UUID gameUuid, UUID playerUuid, List<UUID> cards) {
        Game game = gamesService.getGame(gameUuid);
        return convert2DTO(gameUuid, game.putCardsinHand(playerUuid, cards));
    }
    private Pair<List<DTOcard>, List<DTOcard>> gets(UUID gameUuid, UUID playerUuid, List<UUID> cards) {
        Game game = gamesService.getGame(gameUuid);
        return convert2DTO(gameUuid, game.putCardsinHand(playerUuid, cards));
    }

    private Pair<List<DTOcard>, List<DTOcard>> drawCard (UUID gameUuid, UUID playerUuid){
        Game game = gamesService.getGame(gameUuid);
        return convert2DTO(gameUuid, game.drawCard(playerUuid) );
    }

    private Pair<List<DTOcard>, List<DTOcard>> getCard (UUID gameUuid, UUID playerUuid){
        Game game = gamesService.getGame(gameUuid);
        return convert2DTO(gameUuid, game.getCard(playerUuid) );
    }

    private Pair<List<DTOcard>, List<DTOcard>> putCards (UUID gameUuid, UUID playerUuid, List<UUID> cards){
        Game game = gamesService.getGame(gameUuid);
        return convert2DTO(gameUuid, game.putCards(playerUuid, cards));
    }

    private Pair<List<DTOcard>, List<DTOcard>> putCardsOnTable (UUID gameUuid, UUID playerUuid, Integer place, List<UUID> cards){
        Game game = gamesService.getGame(gameUuid);
        return convert2DTO(gameUuid, game.putCardsOnTable(playerUuid, place, cards));
    }

    private int getNextTablePosition(UUID gameUuid) {
        Game game = gamesService.getGame(gameUuid);
        return game.getNextTablePosition();
    }
    private Card.Back getTopOfStock(UUID gameUuid) {
        Game game = gamesService.getGame(gameUuid);
        return game.getTopOfStock();
    }
    private DTOcard getBottomOfStock(UUID gameUuid) {
        Game game = gamesService.getGame(gameUuid);
        Deck deck = game.getDeck();
        UUID cardUuid = game.getBottomOfStock();
        return new DTOcard(cardUuid, deck.getCard(cardUuid) );
    }

    private Pair<List<DTOcard>, List<DTOcard>>convert2DTO(UUID gameUuid, Pair<List<UUID>, List<UUID>> cards) {
        Game game = gamesService.getGame(gameUuid);
        Deck deck = game.getDeck();
        return Pair.with(
                cards.getValue0().stream().map(cardUuid -> new DTOcard(cardUuid, deck.getCard(cardUuid))).collect(Collectors.toList())
                , cards.getValue1().stream().map(cardUuid -> new DTOcard(cardUuid, deck.getCard(cardUuid))).collect(Collectors.toList())
        );
    }

    private void startGame(UUID gameUuid) {
        Game game = gamesService.getGame(gameUuid);
        game.setStarted(Boolean.TRUE);
    }

    private List<DTOcard> getPlayersHand(UUID gameUuid, UUID playerUuid) {
        Game game = gamesService.getGame(gameUuid);
        Deck deck = game.getDeck();
        return deck.getPlayersHand(playerUuid).stream().map(uuid -> {
            return new DTOcard(uuid, deck.getCard(uuid));
        }).collect(Collectors.toList());
    }


}