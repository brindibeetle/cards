package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@AllArgsConstructor
@EqualsAndHashCode
public class Card {

    public enum Suit {
        CLUBS, DIAMONDS, HEARTS, SPADES
    }

    public enum Rank {
        N2, N3, N4, N5, N6, N7, N8, N9, N10, JACK, QUEEN, KING, ACE
    }

    public enum Back {
        DARK, LIGHT
    }

    public enum Type {
        REGULAR, SPECIAL
    }
    public enum SpecialType {
        JOKER
    }

    @Data
    @AllArgsConstructor
    public class Regular {
        private Suit suit;
        private Rank rank;
    }

    @Data
    @AllArgsConstructor
    public class Special {
        private SpecialType specialType;
    }

    Type type;
    Regular regular;
    Special special;
    private Back back;

    Card( Suit suit, Rank rank, Back back ){
        super();
        type = Type.REGULAR;
        regular = new Regular(suit, rank);
        this.back = back;
    }
    public Card( String suit, String rank, String back ){
        super();
        type = Type.REGULAR;

        Suit suit1 = Enum.valueOf(Suit.class, suit);
        Rank rank1 = Enum.valueOf(Rank.class, rank);
        Back back1 = Enum.valueOf(Back.class, back);

        regular = new Regular(suit1, rank1);
        this.back = back1;
    }

    Card( SpecialType specialType, Back back ){
        super();
        type = Type.SPECIAL;
        special = new Special(specialType);
        this.back = back;
    }
    public Card( String specialType, String back ){
        super();
        type = Type.SPECIAL;

        SpecialType specialType1 = Enum.valueOf(SpecialType.class, specialType);
        Back back1 = Enum.valueOf(Back.class, back);
        special = new Special(specialType1);
        this.back = back1;
    }

    public String getSuitString() {
        switch (type) {
            case REGULAR:
                return regular.getSuit().toString();
            default:
                return "";
        }
    }
    public String getRankString() {
        switch (type) {
            case REGULAR:
                return regular.getRank().toString();
            default:
                return "";
        }
    }
    public String getBackString() {
        return getBack().toString();
    }
    public String getSpecialTypeString() {
        switch (type) {
            case SPECIAL:
                return special.getSpecialType().toString();
            default:
                return "";
        }
    }
}