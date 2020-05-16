package beetle.brindi.cards.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@Data
public class DeckBuilder {

    List<Card.Rank> ranks;
    List<Card.Suit> suits;
    List<Card.Back> backs;
    List<Card.SpecialType> specialTypes;

    List<Card> cards;

    public DeckBuilder()
    {
        cards = new ArrayList<>();
        ranks = new ArrayList<>();
        suits = new ArrayList<>();
        backs = new ArrayList<>();
        specialTypes = new ArrayList<>();
    }

    public DeckBuilder addAllRanks() {
        for (Card.Rank rank : Card.Rank.values()) {
            this.ranks.add(rank);
        }
        return this;
    }
    public DeckBuilder addAllSuits() {
        for (Card.Suit suit : Card.Suit.values()) {
            this.suits.add(suit);
        }
        return this;
    }
    public DeckBuilder addAllBacks() {
        for (Card.Back back : Card.Back.values()) {
            this.backs.add(back);
        }
        return this;
    }
    public DeckBuilder addRegulars() {
        for (Card.Back back : backs ) {
            for (Card.Suit suit : suits) {
                for (Card.Rank rank : ranks) {
                    this.cards.add(new Card(suit, rank, back));
                }
            }
        }
        return this;
    }

    public DeckBuilder addAllSpecialTypes() {
        for (Card.SpecialType specialType : Card.SpecialType.values()) {
            this.specialTypes.add(specialType);
        }
        return this;
    }

    public DeckBuilder addSpecials() {
        for (Card.Back back : backs) {
            for (Card.SpecialType specialType : specialTypes ) {
                this.cards.add(new Card(specialType, back));
            }
        }
        return this;
    }

    public DeckBuilder shuffle() {
        Collections.shuffle(this.cards);

        return this;
    }

    public Deck build() {
        return new Deck(this.cards);
    }
}
