package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.exception.CardsException;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.UUID;

@Data
@NoArgsConstructor
public class DTOcard {

    private UUID uuid;
    private String suit;
    private String rank;
    private String back;

    private String specialType;

    public DTOcard(UUID uuid, Card card){
        this(uuid, card.getSuitString(), card.getRankString(), card.getBackString(), card.getSpecialTypeString());
    }
    public DTOcard(UUID uuid, String suit, String rank, String back, String specialType){
        if (uuid == null)
            throw new CardsException(HttpStatus.CONFLICT, "DTOcard uuid may not be null");

        this.uuid = uuid ;
        this.suit = (suit == null ? "" : suit) ;
        this.rank = (rank == null ? "" : rank) ;
        this.back = (back == null ? "" : back) ;
        this.specialType = (specialType == null ? "" : specialType) ;
    }

    public static DTOcard defaultCard(){
        return new DTOcard( UUID.randomUUID(), Card.defaultCard() );
    }

}
