package beetle.brindi.cards.response;

import beetle.brindi.cards.dto.DTOcard;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
//@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayResponse {

    private DTOcard bottomCard;

    private String topCardBack;

    private TypeResponse typeResponse;

    private List<DTOcard> cards;

    private Integer tablePosition;

    public PlayResponse(DTOcard bottomCard, String topCardBack, TypeResponse typeResponse, List<DTOcard> cards, Integer tablePosition) {
        this.bottomCard = (bottomCard == null) ? DTOcard.defaultCard() : bottomCard;
        this.topCardBack = (topCardBack == null) ? DTOcard.defaultCard().getBack() : topCardBack;
        this.typeResponse = (typeResponse == null) ? TypeResponse.GET : typeResponse;
        this.cards = (cards == null) ? new ArrayList<>() : cards;
        this.tablePosition = (tablePosition == null) ? 0 : tablePosition;
    }
}
