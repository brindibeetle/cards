package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Card;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DTOcard {

    private String suit;
    private String rank;
    private String back;

    private String specialType;

    public DTOcard(Card card){
        suit = card.getSuitString();
        rank = card.getRankString();
        back = card.getBackString();
        specialType = card.getSpecialTypeString();
    }
}
