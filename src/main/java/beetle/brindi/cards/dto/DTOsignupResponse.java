package beetle.brindi.cards.dto;

import lombok.AllArgsConstructor;
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
public class DTOsignupResponse {

    private String gameUuid;

    private String playerUuid;

    private TypeResponse typeResponse;

    private List<DTOgame> games;

    public enum TypeResponse {
        CREATE,
        JOIN,
        GAMES,
        START;
    }

    public DTOsignupResponse(String gameUuid, String playerUuid, TypeResponse typeResponse, List<DTOgame> games) {
        this.gameUuid = ( gameUuid == null ? "<leeg>" : gameUuid );
        this.playerUuid = ( playerUuid == null ? "<leeg>" : playerUuid );
        this.games = ( games == null ? new ArrayList<>() : games );
        this.typeResponse = ( typeResponse == null ? TypeResponse.GAMES : typeResponse );
    }
}
