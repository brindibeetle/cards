package beetle.brindi.cards.dto;

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

    private List<String> games;

    private TypeResponse typeResponse;

    public enum TypeResponse {
        CREATE,
        JOIN,
        GAMES,
        START;
    }

    public DTOsignupResponse(String gameUuid, String playerUuid, List<String> games, TypeResponse typeResponse) {
        this.gameUuid = (gameUuid == null) ? "" : gameUuid;
        this.playerUuid = (playerUuid == null) ? "" : playerUuid;
        this.typeResponse = (typeResponse == null) ? TypeResponse.CREATE : typeResponse;
        this.games = (games == null) ? new ArrayList<>() : games;
    }
}
