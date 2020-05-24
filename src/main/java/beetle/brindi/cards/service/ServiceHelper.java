package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.exception.CardsException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ServiceHelper {

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
        games.entrySet().stream().forEach(e -> dtoGames.add(new DTOgame( e.getKey(), e.getValue()) ));

        return dtoGames;
    }

    public List<String> getGameUuids () {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Map<UUID, Game> games = singleton.getGames().getGames();

        List<String> gameUuids = new ArrayList<>();
        games.entrySet().stream().forEach(e -> gameUuids.add(e.getKey().toString() ));

        return gameUuids;
    }

    Player getPlayer (Game game, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.getInstance();
        Player player = game.getPlayers().get( playerUuid );
        if ( player == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "player not found: " + playerUuid);
        }
        return player;
    }

}
