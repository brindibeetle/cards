package beetle.brindi.cards.domain;

import beetle.brindi.cards.dto.DTOcard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
public class Game {

    private Deck deck;

    private Players players;

    private Player creator;

    private Game() {
        deck = new Deck();
        players = new Players();
    }
    public Game(Deck deck) {
        this();
        this.deck = deck;
    }

    public void addPlayer(String playerName, UUID playerUuidd){
        players.addPlayer(playerName, playerUuidd);
        deck.addPlayer(playerUuidd);
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
        List<Card> tableCards = deck.getFromTable(place);

        List<Card> newCards = new ArrayList();
        cards.forEach(
                card ->
                {
                    if (! tableCards.contains(card) )
                        newCards.add(card);
                });

        List<Card> oldCards = new ArrayList();
        tableCards.forEach(
                card ->
                {
                    if (! cards.contains(card) )
                        oldCards.add(card);
                });


        deck.takeFromHand(playerUuid, newCards );
        deck.putToHand(playerUuid, oldCards );

        deck.putToTable(place, cards);
        return cards;
    }

    public Card.Back getTopOfStock() {
        return deck.showBackOfTopOfStock();
    }
    public Card getBottomOfStock() {
        return deck.showBottomCardOfStock();
    }

    public void setCreator(UUID playerUuid) {
        this.creator = players.get(playerUuid);
    }
}
