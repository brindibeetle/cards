package beetle.brindi.cards.service;

import beetle.brindi.cards.controller.SignupController;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final PlayersService playersService;
    private final GamesService gamesService;
    private final SignupController signupController;

    public void disconnect(String sessionId) {
        Optional<UUID> optionalPlayerUuid = playersService.findPlayerBySessionId(sessionId);

        Optional<UUID> optionalGameUuid = gamesService.findGameBySessionId(sessionId);

        optionalGameUuid.ifPresent(gameUuid ->
                optionalPlayerUuid.ifPresent(playerUuid ->
                        {
                            playersService.removePlayer(gameUuid, playerUuid);
                            if (gamesService.numberOfPlayers(gameUuid) == 0) {
                                gamesService.removeGame(gameUuid);
                            }
                        }
                )
        );
    }

}
