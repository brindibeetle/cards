package beetle.brindi.cards.response;

import beetle.brindi.cards.dto.DTOplayer;
import beetle.brindi.cards.exception.CardsException;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

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
        if (typeResponse == null)
            throw new CardsException(HttpStatus.CONFLICT, "HandResponse typeResponse may not be null.");
        if (phase == null)
            throw new CardsException(HttpStatus.CONFLICT, "HandResponse phase may not be null.");

        this.typeResponse = typeResponse;
        this.phase = phase;
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
