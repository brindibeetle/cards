package beetle.brindi.cards.request;

import beetle.brindi.cards.dto.DTOcard;
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
public class PlayRequest {

    private TypeRequest typeRequest;

    private UUID gameUuid;

    private UUID playerUuid;

    private List<DTOcard> cards;

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

    public PlayRequest(PlayRequest.TypeRequest typeRequest, UUID gameUuid, UUID playerUuid, List<DTOcard> cards, Integer handPosition, Integer tablePosition) {
        this.typeRequest = (typeRequest == null) ? TypeRequest.PUT_ON_TABLE : typeRequest;
        this.gameUuid = (gameUuid == null) ? fixedUUID() : gameUuid;
        this.playerUuid = (playerUuid == null) ? fixedUUID() : playerUuid;
        this.cards = (cards == null) ? new ArrayList<>() : cards;
        this.handPosition = (handPosition == null) ? 0 : handPosition;
        this.tablePosition = (tablePosition == null) ? 0 : tablePosition;
    }

    protected UUID fixedUUID() {
        return UUID.fromString("7b3c1e7e-ddba-4345-8ab2-e3ca8869406b");
    }
}
