package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Player;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class DTOplayer {

    private String playerName;

    private UUID playerUuid;

    private Player.Status playerStatus;

    public DTOplayer(UUID playerUuid, Player player){
        this.playerUuid = playerUuid;
        this.playerName = player.getName();
        this.playerStatus = player.getStatus();
    }


}
