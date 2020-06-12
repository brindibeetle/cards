package beetle.brindi.cards.response;

import beetle.brindi.cards.dto.DTOgame;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignupAllResponse {

    private String gameUuid;

    private TypeResponse typeResponse;

    private List<DTOgame> games;

    public enum TypeResponse {
        GAMES_AND_PLAYERS,
        START
    }

    public SignupAllResponse(String gameUuid, TypeResponse typeResponse, List<DTOgame> games) {
        this.gameUuid = ( gameUuid == null ? "<leeg>" : gameUuid );
        this.games = ( games == null ? new ArrayList<>() : games );
        this.typeResponse = ( typeResponse == null ? TypeResponse.GAMES_AND_PLAYERS : typeResponse );
    }
}
