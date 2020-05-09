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

    private Game() {
        deck = new Deck();
        players = new Players();
    }
    public Game(Deck deck) {
        this();
        this.deck = deck;
    }

    public UUID addPlayer(String playerName){
        UUID playerUuid = players.addPlayer(playerName);
        deck.addPlayer(playerUuid);
        return playerUuid;
    }

    public List<Card> dealCards(UUID playerUuid, Integer number){
        List<Card> cards = deck.takeFromStock(number);
        deck.putToHand(playerUuid, cards);
        return cards;
    }

    public List<Card> drawCard(UUID playerUuid) {
        List<Card> cards = deck.takeFromStock(1);
        deck.putToHand(playerUuid, cards);
        return cards;
    }

    public List<Card> getCard(UUID playerUuid) {
        List<Card> cards = deck.takeFromStockBottom(1 );
        deck.putToHand(playerUuid, cards);
        return cards;
    }

    public void putCards(UUID playerUuid, List<Card> cards) {
        deck.takeFromHand(playerUuid, cards );
        deck.putToStock(cards);
    }

    public List<Card> putCardsOnTable(UUID playerUuid, Integer place, List<Card> cards) {
        deck.takeFromHand(playerUuid, cards );
        deck.putToTable(place, cards);
        return cards;
    }

    public Card.Back getTopOfStock() {
        return deck.showBackOfTopOfStock();
    }
    public Card getBottomOfStock() {
        return deck.showBottomCardOfStock();
    }

}
