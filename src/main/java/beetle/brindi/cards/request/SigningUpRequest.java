package beetle.brindi.cards.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
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
        JOIN,
        GAMES_AND_PLAYERS;
    }
}
