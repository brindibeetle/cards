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

    public Pair<List<UUID>,List<UUID>> dealCards(UUID playerUuid, Integer number){
        List<UUID> cards = deck.takeFromStock(number);
        deck.putToHand(playerUuid, cards);
        return Pair.with(new ArrayList<>(), cards);
    }

    public Pair<List<UUID>,List<UUID>> drawCard(UUID playerUuid) {
        List<UUID> cards = deck.takeFromStock(1);
        deck.putToHand(playerUuid, cards);
        return Pair.with(cards, cards);
    }

    public Pair<List<UUID>,List<UUID>> getCard(UUID playerUuid) {
        List<UUID> cards = deck.takeFromStockBottom(1 );
        deck.putToHand(playerUuid, cards);
        return Pair.with(cards, cards);
    }

    public Pair<List<UUID>,List<UUID>> putCards(UUID playerUuid, List<UUID> cards) {
        deck.takeFromHand(playerUuid, cards );
        deck.putToStock(cards);
        return Pair.with(cards, cards);
    }

    public Pair<List<UUID>,List<UUID>> putCardsOnTable(UUID playerUuid, Integer place, List<UUID> cards) {
        List<UUID> tableCards = deck.getFromTable(place);

        List<UUID> newCards = new ArrayList();
        cards.forEach(
                cardUuid ->
                {
                    if (! tableCards.contains(cardUuid) )
                        newCards.add(cardUuid);
                });

        List<UUID> oldCards = new ArrayList();
        tableCards.forEach(
                cardUuid ->
                {
                    if (! cards.contains(cardUuid) )
                        oldCards.add(cardUuid);
                });


        deck.takeFromHand(playerUuid, newCards );
        deck.putToHand(playerUuid, oldCards );

        deck.putToTable(place, cards);
        return Pair.with(cards, oldCards);
    }

    public Card.Back getTopOfStock() {
        return deck.showBackOfTopOfStock();
    }
    public UUID getBottomOfStock() {
        return deck.showBottomCardOfStock();
    }

    public void setCreator(UUID playerUuid) {
        this.creator = playerUuid;
    }

    public int getNextTablePosition() {
        return deck.getNextTablePosition();
    }

    public Pair<List<UUID>, List<UUID>> putCardsinHand(UUID playerUuid, List<UUID> cards) {

        deck.getFromStock(cards);
        deck.putToHand(playerUuid, cards);
        return Pair.with(cards, cards);
    }

}
