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
public class PlayResponse {

    private DTOcard bottomCard;

    private String topCardBack;

    private TypeResponse typeResponse;

    private List<DTOcard> cards;

    private Integer tablePosition;

    public PlayResponse(DTOcard bottomCard, String topCardBack, TypeResponse typeResponse, List<DTOcard> cards, Integer tablePosition) {
//        if (bottomCard == null)
//            throw new CardsException(HttpStatus.CONFLICT, "PlayResponse bottomCard may not be null");
//
//        if (topCardBack == null)
//            throw new CardsException(HttpStatus.CONFLICT, "PlayResponse topCardBack may not be null");

        if (typeResponse == null)
            throw new CardsException(HttpStatus.CONFLICT, "PlayResponse typeResponse may not be null");

        this.bottomCard = (bottomCard == null) ? DTOcard.defaultCard() : bottomCard;
        this.topCardBack = (topCardBack == null) ? DTOcard.defaultCard().getBack() : topCardBack;
        this.typeResponse = typeResponse;
        this.cards = (cards == null) ? new ArrayList<>() : cards;
        this.tablePosition = (tablePosition == null) ? 0 : tablePosition;
    }
}
