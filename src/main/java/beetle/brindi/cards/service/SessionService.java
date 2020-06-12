package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.controller.PlayController;
import beetle.brindi.cards.controller.SigningUpController;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOplayer;
import beetle.brindi.cards.response.GameResponse;
import beetle.brindi.cards.response.HandResponse;
import beetle.brindi.cards.response.PlayResponse;
import beetle.brindi.cards.response.PlayingResponse;
import beetle.brindi.cards.response.SigningUpResponse;
import beetle.brindi.cards.response.SignupAllResponse;
import beetle.brindi.cards.response.SignupPersonalResponse;
import beetle.brindi.cards.response.TypeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final PlayersService playersService;
    private final GamesService gamesService;
    private final SigningUpController signUpController;
    private final PlayController playController;

    public void disconnect(String sessionId) {
        Optional<UUID> optionalPlayerUuid = playersService.findPlayerBySessionId(sessionId);

        Optional<UUID> optionalGameUuid = gamesService.findGameBySessionId(sessionId);

        optionalGameUuid.ifPresent(gameUuid ->
                optionalPlayerUuid.ifPresent(playerUuid -> disconnect(gameUuid, playerUuid) )
        );
    }

    private void disconnect(UUID gameUuid, UUID playerUuid) {
        boolean gameHasStarted = gamesService.getGame(gameUuid).getStarted();

        if (Boolean.FALSE.equals(gameHasStarted)) {

            if (gamesService.isCreator(gameUuid, playerUuid)) {
                playersService.disconnectPlayer(gameUuid, playerUuid);
                gamesService.disconnectGame(gameUuid);
            } else {
                playersService.disconnectPlayer(gameUuid, playerUuid);
            }

            signUpController.signupEvent(signupResponse(gameUuid), playerUuid);

        } else {
            Optional<GameResponse> gameResponse = Optional.empty();
            Optional<PlayResponse> playResponse = Optional.empty();
            Optional<HandResponse> handResponse = Optional.empty();

            if (gamesService.isLastPlayer(gameUuid, playerUuid)) {

                playersService.disconnectPlayer(gameUuid, playerUuid);
                gamesService.disconnectGame(gameUuid);

            } else {

                Game game = CardsSingleton.getInstance().getGames().get(gameUuid);

                if ( playerUuid.equals(game.getPlayers().currentPlayer() )) {

                    playersService.disconnectPlayer(gameUuid, playerUuid);
                    gameResponse = Optional.of( gameResponseNextPlayer(gameUuid) );
                    playResponse = Optional.of( playResponse(gameUuid) );

                } else {

                    playersService.disconnectPlayer(gameUuid, playerUuid);
                    gameResponse = Optional.of( gameResponse(gameUuid) );
                    playResponse = Optional.of( playResponse(gameUuid) );

                }
            }

            playController.playEvent(new PlayingResponse(playResponse, handResponse, gameResponse), gameUuid, playerUuid);
        }
    }

    private SigningUpResponse signupResponse(UUID gameUuid) {
        Optional<SignupAllResponse> signupAllResponse = Optional.empty();
        Optional<SignupPersonalResponse> signupPersonalResponse = Optional.empty();

        signupAllResponse =
                Optional.of(
                    SignupAllResponse.builder()
                            .gameUuid(gameUuid.toString())
                            .typeResponse(SignupAllResponse.TypeResponse.GAMES_AND_PLAYERS)
                            .games(gamesService.getGames())
                            .build()
                );

        return new SigningUpResponse(signupAllResponse, signupPersonalResponse);
    }

    private GameResponse gameResponseNextPlayer(UUID gameUuid) {
        return GameResponse.builder()
            .typeResponse(GameResponse.TypeResponse.GAME)
            .players(
                    playersService.getPlayers(gameUuid).entrySet().stream()
                            .map(uuidPlayerEntry -> new DTOplayer(uuidPlayerEntry.getKey(), uuidPlayerEntry.getValue()))
                            .collect(Collectors.toList())
            )
            .currentPlayer(playersService.currentPlayer(gameUuid))
            .phase(GameResponse.Phase.DRAW)
            .build();
    }

    private GameResponse gameResponse(UUID gameUuid) {
        return GameResponse.builder()
            .typeResponse(GameResponse.TypeResponse.PLAYERS)
            .players(
                    playersService.getPlayers(gameUuid).entrySet().stream()
                            .map(uuidPlayerEntry -> new DTOplayer(uuidPlayerEntry.getKey(), uuidPlayerEntry.getValue()))
                            .collect(Collectors.toList())
            )
            .build();
    }

    private PlayResponse playResponse(UUID gameUuid) {
        Game game = CardsSingleton.getInstance().getGames().get(gameUuid);
        return PlayResponse.builder()
            .bottomCard(new DTOcard(game.getBottomOfStock()))
            .topCardBack(game.getTopOfStock().toString())
            .typeResponse(TypeResponse.PUT_ON_STACK_BOTTOM)
            .build();
    }

}
