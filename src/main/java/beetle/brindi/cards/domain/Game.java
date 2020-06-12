package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.javatuples.Pair;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
public class Game {

    private String name;

    private Boolean started;

    private Deck deck;

    private Players players;

    private UUID creator;

    private Game() {
        deck = new Deck();
        players = new Players();
    }
    public Game(Deck deck) {
        this();
        this.deck = deck;
    }

    public void addPlayer(String playerName, String sessionId, UUID playerUuid){
        players.addPlayer(playerName, sessionId, playerUuid);
        deck.addPlayer(playerUuid);
    }
    public void disconnectPlayer(UUID playerUuid){
        players.remove(playerUuid);
        deck.removePlayer(playerUuid);
    }

    public Pair<List<Card>,List<Card>> dealCards(UUID playerUuid, Integer number){
        List<Card> cards = deck.takeFromStock(number);
        deck.putToHand(playerUuid, cards);
        return Pair.with(new ArrayList<>(), cards);
    }

    public Pair<List<Card>,List<Card>> drawCard(UUID playerUuid) {
        List<Card> cards = deck.takeFromStock(1);
        deck.putToHand(playerUuid, cards);
        return Pair.with(cards, cards);
    }

    public Pair<List<Card>,List<Card>> getCard(UUID playerUuid) {
        List<Card> cards = deck.takeFromStockBottom(1 );
        deck.putToHand(playerUuid, cards);
        return Pair.with(cards, cards);
    }

    public Pair<List<Card>,List<Card>> putCards(UUID playerUuid, List<Card> cards) {
        deck.takeFromHand(playerUuid, cards );
        deck.putToStock(cards);
        return Pair.with(cards, cards);
    }

    public Pair<List<Card>,List<Card>> putCardsOnTable(UUID playerUuid, Integer place, List<Card> cards) {
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
        return Pair.with(cards, newCards);
    }

    public Card.Back getTopOfStock() {
        return deck.showBackOfTopOfStock();
    }
    public Card getBottomOfStock() {
        return deck.showBottomCardOfStock();
    }

    public void setCreator(UUID playerUuid) {
        this.creator = playerUuid;
    }
}
