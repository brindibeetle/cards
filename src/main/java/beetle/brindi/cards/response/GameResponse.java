package beetle.brindi.cards.response;

import beetle.brindi.cards.dto.DTOplayer;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameResponse {

    private TypeResponse typeResponse;

    private Phase phase;

    private List<DTOplayer> players;

    private String currentPlayerUuid;

    public GameResponse(TypeResponse typeResponse, Phase phase, List<DTOplayer> players, String currentPlayerUuid) {
        this.typeResponse = (typeResponse == null) ? TypeResponse.GAME : typeResponse;
        this.phase = (phase == null) ? Phase.WAITING : phase;
        this.players = (players == null) ? new ArrayList<>() : players;
        this.currentPlayerUuid = (currentPlayerUuid == null) ? "" : currentPlayerUuid;
    }

    public enum TypeResponse {
        GAME
        , PLAYERS
    }

    public enum Phase {
        DRAW
        , PUT
        , WAITING
    }

}
