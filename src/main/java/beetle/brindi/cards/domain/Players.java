package beetle.brindi.cards.domain;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
//@AllArgsConstructor
//@Builder
public class Players {

    private Map<UUID, Player> players;
    private UUID current;

    public Players() {
        players = new HashMap<>();
    }

    public Integer number() {
        return players.size();
    }

    public Players( String firstPlayer, UUID playerUuid ) {
        players = new HashMap<>();

        players.put(playerUuid, new Player(firstPlayer));
        current = playerUuid;
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

    public void addPlayer(String playerName, UUID playerUuid) {
        Player player = new Player(playerName);
        this.add(playerUuid, new Player(playerName));
        if ( current == null ) current = playerUuid;
    }
}
