package beetle.brindi.cards.domain;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.UUID;

@Data
//@AllArgsConstructor
//@Builder
public class Players {

    private HashMap<UUID, Player> players;
    private UUID current;

    public Players() {
        players = new HashMap<>();
    }

    public Integer number() {
        return players.size();
    }

    public Players( UUID uuid, Player firstPlayer ) {
        players = new HashMap<>();
        players.put(uuid, firstPlayer);
        current = uuid;
    }

    public void add ( UUID uuid, Player player ) {
        players.put(uuid, player);
    }

    public Player get(UUID uuid) {
        return players.get(uuid);
    }

    public Player nextPlayer() {
        // some implementation, maybe with a linked list?
        return players.get(current);
    }
}
