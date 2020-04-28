package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Game;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class DTOgame {

    UUID gameUuid;

    UUID playerUuid;

    public DTOgame(UUID uuid, Game game ){
        super();

        gameUuid = uuid;

        playerUuid = game.getPlayers().getCurrent();
    }
}
