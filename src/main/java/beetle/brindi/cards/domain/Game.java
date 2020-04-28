package beetle.brindi.cards.domain;

import beetle.brindi.cards.dto.DTOcard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
public class Game {

    private Deck deck;

    private Players players;

    public Game() {
        deck = new Deck();
        players = new Players();
    }
    public void addPlayer(UUID uuid, Player player){
        players.add(uuid, player);
    }

    public List<Card> dealCards(Integer number){
        return deck.take(number, Place.STOCK, Place.HAND );
    }

    public Card drawCard() {
        return deck.take(1, Place.STOCK, Place.HAND ).get(0);
    }

    public Card putCard(Card card) {
        return deck.take(card, Place.HAND, Place.STOCK );
    }
}
