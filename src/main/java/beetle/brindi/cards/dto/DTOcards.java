package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Card;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
//@AllArgsConstructor
public class DTOcards {

    List<DTOcard> cards;

    public DTOcards() {
        super();
        cards = new ArrayList<>();
    }

    public DTOcards(List<Card> cards ){
            super();

        this.cards = cards.stream()
                .map( card -> new DTOcard(card) )
                .collect(Collectors.toList());
    }
}
