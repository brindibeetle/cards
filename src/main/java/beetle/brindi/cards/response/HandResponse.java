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
public class HandResponse {

    private TypeResponse typeResponse;

    private List<DTOcard> cards;

    private Integer handPosition;

    public HandResponse(TypeResponse typeResponse, List<DTOcard> cards, Integer handPosition) {
        this.typeResponse = (typeResponse == null) ? TypeResponse.GET : typeResponse;
        this.cards = (cards == null) ? new ArrayList<>() : cards;
        this.handPosition = (handPosition == null) ? 0 : handPosition;
    }
}
