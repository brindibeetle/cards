package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.Player;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
//@AllArgsConstructor
@NoArgsConstructor
public class DTOgame {

    private String gameName;

    private Boolean started;

    private UUID gameUuid;

    private List<DTOplayer> players;

    private String creator;

    public DTOgame(String gameName, Boolean started, UUID gameUuid, List<DTOplayer> players) {
        this.gameName = ( gameName == null ? "" : gameName );
        this.started = ( started == null ? Boolean.FALSE : started );
        this.gameUuid = ( gameUuid == null ? UUID.randomUUID() : gameUuid );
        this.players = ( players == null ? new ArrayList<>() : players );
        this.creator = ( creator == null ? "" : creator );
    }

    public DTOgame(UUID gameUuid, Game  game){
        this.gameName = game.getName();
        this.gameUuid = gameUuid;
        this.players = new ArrayList<>();
        this.started = game.getStarted();
        this.creator = game.getCreator().getName();

        Map<UUID, Player> players =  game.getPlayers().getPlayers();
        for (Map.Entry<UUID, Player> entry : players.entrySet() ) {
            DTOplayer dtoPlayer = new DTOplayer(entry.getKey(), entry.getValue());
            this.players.add(dtoPlayer);
        }

    }
}
