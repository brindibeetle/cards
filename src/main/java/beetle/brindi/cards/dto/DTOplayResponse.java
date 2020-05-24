package beetle.brindi.cards.dto;

import lombok.AllArgsConstructor;
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
public class DTOplayResponse {

    private DTOcard bottomCard;

    private String topCardBack;

    private TypeResponse typeResponse;

    private List<DTOcard> cards;

    private Integer handPosition;

    private Integer tablePosition;

    public enum TypeResponse {
        PUT_ON_TABLE,
        SLIDE_ON_TABLE,
        DEAL,
        PUT_ON_STACK_BOTTOM,
        GET
    }

    public DTOplayResponse(DTOcard bottomCard, String topCardBack, TypeResponse typeResponse, List<DTOcard> cards, Integer handPosition, Integer tablePosition) {
        this.bottomCard = (bottomCard == null) ? DTOcard.defaultCard() : bottomCard;
        this.topCardBack = (topCardBack == null) ? DTOcard.defaultCard().getBack() : topCardBack;
        this.typeResponse = (typeResponse == null) ? TypeResponse.GET : typeResponse;
        this.cards = (cards == null) ? new ArrayList<>() : cards;
        this.handPosition = (handPosition == null) ? 0 : handPosition;
        this.tablePosition = (tablePosition == null) ? 0 : tablePosition;
    }
}
