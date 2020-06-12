package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Games;
import beetle.brindi.cards.domain.Players;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.exception.CardsException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class GamesService {

    Game getGame (UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Game game = singleton.getGames().get( gameUuid );
        if ( game == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "Game not found: " + gameUuid );
        }
        return game;
    }

    public List<DTOgame> getGames () {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Map<UUID, Game> games = singleton.getGames().getGames();

        List<DTOgame> dtoGames = new ArrayList<>();
        for(Map.Entry<UUID, Game> keyValue: games.entrySet()) {
            Game game = keyValue.getValue();
            DTOgame dtoGame = new DTOgame(keyValue.getKey(), game);
            dtoGames.add(dtoGame);
        }

        return dtoGames;
    }

    public List<String> getGameUuids () {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Map<UUID, Game> games = singleton.getGames().getGames();

        List<String> gameUuids = new ArrayList<>();
        games.entrySet().stream().forEach(e -> gameUuids.add(e.getKey().toString() ));

        return gameUuids;
    }

    public Optional<UUID> findGameBySessionId(String sessionId){
        CardsSingleton singleton = CardsSingleton.getInstance();
        Games games = singleton.getGames();

        AtomicReference<UUID> found = new AtomicReference<UUID>(null);
        games.getGames().forEach(
                (uuid, game) -> game.getPlayers().getPlayers().forEach(
                        (uuid1, player) -> { if ( sessionId.equals(player.getSessionId())) found.set(uuid); }
                )
        );
        return Optional.ofNullable(found.get());
    }

    public int numberOfPlayers(UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Game game = singleton.getGames().getGames().get(gameUuid);
        return game.getPlayers().getPlayers().size();
    }

    public void disconnectGame(UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        singleton.getGames().getGames().remove(gameUuid);
    }

    public boolean isCreator(UUID gameUuid, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        return playerUuid.equals( singleton.getGames().get(gameUuid).getCreator() ) ;
    }

    public boolean isLastPlayer(UUID gameUuid, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Players players = singleton.getGames().get(gameUuid).getPlayers();

        return players.number() == 1 && players.get(playerUuid) != null ;
    }
}
