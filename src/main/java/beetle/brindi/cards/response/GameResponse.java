package beetle.brindi.cards.response;

import beetle.brindi.cards.dto.DTOplayer;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameResponse {

    private Phase phase;

    private List<DTOplayer> players;

    private DTOplayer currentPlayer;

    public GameResponse(Phase phase, List<DTOplayer> players, DTOplayer currentPlayer) {
        this.phase = (phase == null) ? Phase.WAITING : phase;
        this.players = (players == null) ? new ArrayList<>() : players;
        this.currentPlayer = (currentPlayer == null) ? new DTOplayer("", UUID.randomUUID()) : currentPlayer;
    }

    public enum Phase {
        DRAW
        , PUT
        , WAITING
    }
}
