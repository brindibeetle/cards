package beetle.brindi.cards.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
//@AllArgsConstructor
//@Builder
public class Players {

    private Map<UUID, Player> players;
    private List<UUID> playersOrder;
    private int current;

    public Players() {
        players = new HashMap<>();
        playersOrder = new ArrayList<>();
    }

    public Integer number() {
        return players.size();
    }

    public Players( String firstPlayer, String sessionId, UUID playerUuid ) {
        this();

        players.put(playerUuid, new Player(firstPlayer, sessionId));
        playersOrder.add(playerUuid);
    }

    public void add ( UUID uuid, Player player ) {
        players.put(uuid, player);
        playersOrder.add(uuid);
    }

    public Player remove ( UUID uuid ) {
        playersOrder.remove(uuid);
        if ( current >= playersOrder.size() ) {
            current = 0;
        }
        return players.remove(uuid);
    }

    public Player get(UUID uuid) {
        return players.get(uuid);
    }

    public UUID nextPlayer() {
        current ++;
        return currentPlayer();
    }

    public UUID currentPlayer() {
        if ( current >= playersOrder.size() ) {
            current = 0;
        }
        return playersOrder.get(current);
    }

    public void addPlayer(String playerName, String sessionId, UUID playerUuid) {
        this.add(playerUuid, new Player(playerName, sessionId));
    }

}
