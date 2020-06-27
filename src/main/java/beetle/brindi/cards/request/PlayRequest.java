package beetle.brindi.cards.request;

import beetle.brindi.cards.exception.CardsException;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayRequest {

    private TypeRequest typeRequest;

    private UUID gameUuid;

    private UUID playerUuid;

    private List<UUID> cardUUIDs;

    private Integer handPosition;

    private Integer tablePosition;

    public enum TypeRequest {
        GET_FROM_STACK_BOTTOM,
        GET_FROM_STACK_TOP,
        PUT_ON_STACK_BOTTOM,
        DEAL,
        PUT_ON_TABLE,
        SLIDE_ON_TABLE,
        // only for testing purpose, instead of deal:
        GET_FROM_STACK;
    }

    public PlayRequest(PlayRequest.TypeRequest typeRequest, UUID gameUuid, UUID playerUuid, List<UUID> cardUUIDs, Integer handPosition, Integer tablePosition) {
        if (typeRequest == null)
            throw new CardsException(HttpStatus.CONFLICT, "PlayRequest typeRequest may not be null");

        if (gameUuid == null)
            throw new CardsException(HttpStatus.CONFLICT, "PlayRequest gameUuid may not be null");

        if (playerUuid == null)
            throw new CardsException(HttpStatus.CONFLICT, "PlayRequest playerUuid may not be null");

        this.typeRequest = typeRequest;
        this.gameUuid = gameUuid;
        this.playerUuid = playerUuid;
        this.cardUUIDs = (cardUUIDs == null) ? new ArrayList<>() : cardUUIDs;
        this.handPosition = (handPosition == null) ? 0 : handPosition;
        this.tablePosition = (tablePosition == null) ? 0 : tablePosition;
    }

    protected UUID fixedUUID() {
        return UUID.fromString("7b3c1e7e-ddba-4345-8ab2-e3ca8869406b");
    }
}
