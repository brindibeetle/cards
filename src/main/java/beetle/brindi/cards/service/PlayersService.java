package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Games;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.dto.DTOplayer;
import beetle.brindi.cards.exception.CardsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class PlayersService {

    GamesService gamesService;

    public void addPlayer(UUID gameUuid, UUID playerUuid, String playerName, String sessionId) {
        CardsSingleton singleton = CardsSingleton.getInstance();

        Game game = singleton.getGames().get( gameUuid);
        game.addPlayer(playerName, sessionId, playerUuid);  // needs refactor
    }

    public Map<UUID, Player> getPlayers (UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();

        Game game = singleton.getGames().get( gameUuid);
        return game.getPlayers().getPlayers();
    }

    public DTOplayer currentPlayer (UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();

        Game game = singleton.getGames().get( gameUuid);
        UUID playerUuid = game.getPlayers().currentPlayer();
        return new DTOplayer(playerUuid, game.getPlayers().get(playerUuid));
    }

    public DTOplayer nextPlayer (UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();

        Game game = singleton.getGames().get( gameUuid);
        UUID playerUuid = game.getPlayers().nextPlayer();
        return new DTOplayer(playerUuid, game.getPlayers().get(playerUuid));
    }

    public Player getPlayer (UUID gameUuid, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();

        Game game = singleton.getGames().get( gameUuid);
        Player player = game.getPlayers().get( playerUuid );

        if ( player == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "player not found: " + playerUuid);
        }
        return player;
    }

    public Optional<UUID> findPlayerBySessionId(String sessionId){
        CardsSingleton singleton = CardsSingleton.getInstance();
        Games games = singleton.getGames();

        AtomicReference<UUID> found = new AtomicReference<UUID>(null);
        games.getGames().forEach(
                (uuid, game) -> game.getPlayers().getPlayers().forEach(
                        (uuid1, player) -> { if ( sessionId.equals(player.getSessionId())) found.set(uuid1); }
                )
        );
        return Optional.ofNullable(found.get());
    }

    public void disconnectPlayer(UUID gameUuid, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Game game = singleton.getGames().get(gameUuid);

        game.getPlayers().remove(playerUuid);
    }

}
