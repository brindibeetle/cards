package beetle.brindi.cards.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DTOstackResponse {

    private DTOcard bottomCard;

    private String topCardBack;

    public DTOstackResponse(DTOcard bottomCard, String topCardBack) {
        this.bottomCard = (bottomCard == null) ? DTOcard.defaultCard() : bottomCard;
        this.topCardBack = (topCardBack == null) ? DTOcard.defaultCard().getBack() : topCardBack;
    }
}
