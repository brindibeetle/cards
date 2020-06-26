package beetle.brindi.cards.request;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SigningUpRequest {

    private TypeRequest typeRequest;

    private String playerName;

    private UUID playerUuid;

    private String gameName;

    private UUID gameUuid;

    public enum TypeRequest {
        START,
        CREATE,
        DESTROY,
        JOIN,
        DETACH,
        GAMES_AND_PLAYERS;
    }

    public SigningUpRequest(SigningUpRequest.TypeRequest typeRequest, String playerName, UUID playerUuid, String gameName, UUID gameUuid) {
        this.typeRequest = (typeRequest == null) ? TypeRequest.START : typeRequest;
        this.playerName = (playerName == null) ? "" : playerName;
        this.playerUuid = (playerUuid == null) ? fixedUUID() : playerUuid;
        this.gameName = (gameName == null) ? "" : gameName;
        this.gameUuid = (gameUuid == null) ? fixedUUID() : gameUuid;
    }

    protected UUID fixedUUID() {
        return UUID.fromString("7b3c1e7e-ddba-4345-8ab2-e3ca8869406b");
    }
}
