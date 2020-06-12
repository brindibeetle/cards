package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@AllArgsConstructor
public class Games {

    private Map<UUID, Game> games;

    public Games() {
        games = new HashMap<>();
    }
    public Game get(UUID uuid) {
        return games.get(uuid);
    }

    public Game remove(UUID uuid) {
        Game game = get(uuid);
        games.remove(uuid);
        return game;
    }
}
