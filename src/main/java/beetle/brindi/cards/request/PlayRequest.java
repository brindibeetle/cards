package beetle.brindi.cards.request;

import beetle.brindi.cards.dto.DTOcard;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
        SLIDE_ON_TABLE;
    }
}
