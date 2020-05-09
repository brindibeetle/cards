package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
