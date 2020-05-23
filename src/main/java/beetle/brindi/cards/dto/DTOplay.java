package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Card;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DTOplay {

    private UUID gameUuid;

    private UUID playerUuid;

    private List<DTOcard> cards;

    private Integer actionNumber;

    private Action action;

    private String topCardBack;     // see only backside
    private DTOcard bottomCard;

    public enum Action {
        TABLE,
        TABLEMOD,
        DEAL,
        PUT,
        GET,
        DRAW
    }

}
