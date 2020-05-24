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
public class DTOtableResponse {

    private TypeResponse typeResponse;

    private List<DTOcard> cards;

    private Integer tablePosition;

    public enum TypeResponse {
        ADD,
        SLIDE
    }

    public DTOtableResponse(TypeResponse typeResponse, List<DTOcard> cards, Integer tablePosition) {
        this.typeResponse = (typeResponse == null) ? TypeResponse.ADD : typeResponse;
        this.cards = (cards == null) ? new ArrayList<>() : cards;
        this.tablePosition = (tablePosition == null) ? 0 : tablePosition;
    }
}
