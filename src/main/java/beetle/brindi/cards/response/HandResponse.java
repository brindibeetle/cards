package beetle.brindi.cards.response;

import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.exception.CardsException;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

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
        if (typeResponse == null)
            throw new CardsException(HttpStatus.CONFLICT, "HandResponse typeResponse may not be null.");

        this.typeResponse = typeResponse;
        this.cards = (cards == null) ? new ArrayList<>() : cards;
        this.handPosition = (handPosition == null) ? 0 : handPosition;
    }
}
