package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Card;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DTOcard {

    private String suit;
    private String rank;
    private String back;

    private String specialType;

    public DTOcard(Card card){
        this(card.getSuitString(), card.getRankString(), card.getBackString(), card.getSpecialTypeString());
    }
    public DTOcard(String suit, String rank, String back, String specialType){
        this.suit = (suit == null ? "" : suit) ;
        this.rank = (rank == null ? "" : rank) ;
        this.back = (back == null ? "" : back) ;
        this.specialType = (specialType == null ? "" : specialType) ;
    }

    public static DTOcard defaultCard(){
        return new DTOcard( Card.defaultCard() );
    }

}
