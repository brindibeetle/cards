package beetle.brindi.cards.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DTOsignupRequest {

    private TypeRequest typeRequest;

    private String playerName;

    private UUID playerUuid;

    private UUID gameUuid;

    public enum TypeRequest {
        CREATE,
        JOIN,
        GAMES;

    }
}
