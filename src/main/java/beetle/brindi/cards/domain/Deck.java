package beetle.brindi.cards.domain;

import beetle.brindi.cards.exception.CardsException;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;

@Data
@AllArgsConstructor
public class Deck {

//    private Map<Place, List<Card>> cards;

    private Map<UUID, Card> cardUuids;
    private List<UUID> cardsStock;
    private Map<Integer, List<UUID>> cardsTable;
    private Map<UUID, List<UUID>> cardsHand;

    public Deck() {
        cardUuids = new HashMap<>();
        cardsStock = new ArrayList<>();
        cardsTable = new HashMap<>();
        cardsHand = new HashMap<>();
    }
    public Deck(List<Card> cards) {
        this();

        cards.forEach(card -> {
            UUID uuid = UUID.randomUUID();
            cardUuids.put(uuid, card);
            cardsStock.add(uuid);
        });
    }

    public Card getCard(UUID cardUuid){
        return cardUuids.get(cardUuid);
    }

    /*
        Cards on each place are treated as fifo-stacks.
        Cards are taken from the "top"-side and put back at the "bottom"-side.
        As cards are represented as List, the top-side is 0, and the bottom is List.size()-1.
    */
    public List<UUID> takeFromStock( int number ) {
        List<UUID> takenCards =
                IntStream.range(0, number)
                .mapToObj(cardsStock::get)
                .collect(toList());

        cardsStock =
                IntStream.range(number, cardsStock.size() )
                        .mapToObj(cardsStock::get)
                        .collect(toList());

        return takenCards;
    }

    public List<UUID> takeFromStockBottom( int number) {
        List<UUID> takenCards =
                IntStream.range(0, number)
                        .mapToObj(i -> cardsStock.get(cardsStock.size() - 1 - i))
                        .collect(toList());
        cardsStock =
                IntStream.range(0, cardsStock.size() - number )
                        .mapToObj(cardsStock::get)
                        .collect(toList());

        return takenCards;
    }

    public void putToStock(List<UUID> cardUuids) {
        // cards are added to the "bottom"
        List<UUID> cardsStockBecomes = new ArrayList<>(cardsStock);
        cardsStockBecomes.addAll(cardUuids);
        cardsStock = cardsStockBecomes;
    }

    public void getFromStock(List<UUID> cardUuids) {
        List<UUID> cardsStockBecomes = new ArrayList<>(cardsStock);

        cardUuids.forEach(cardUuid ->
        {
            if (!cardsStockBecomes.remove(cardUuid))
            {
                throw new CardsException(HttpStatus.CONFLICT, "The card is not present in the stock, card : " + cardUuid + " (" + getCard(cardUuid) + ")");
            }
        });
        cardsStock = cardsStockBecomes;
    }

    public void takeFromHand(UUID playerUuid, List<UUID> cardUuids ) {
        List<UUID> cardsPlayer = cardsHand.get(playerUuid);

        cardUuids.forEach(cardUuid ->
        {
            if (!cardsPlayer.remove(cardUuid))
            {
                throw new CardsException(HttpStatus.CONFLICT, "The card is not present in the players hand, player : " + playerUuid + ", card : " + cardUuid + " (" + getCard(cardUuid) + ")");
            }
        });
    }

    public void putToHand(UUID playerUuid, List<UUID> cardUuids ) {
        cardsHand.get(playerUuid).addAll(cardUuids);
    }

    public void addPlayer(UUID playerUuid) {
        cardsHand.put(playerUuid, new ArrayList<>());
    }

    public void removePlayer(UUID playerUuid) {
        List<UUID> cardUuids = cardsHand.get(playerUuid);
        putToStock(cardUuids);
        cardsHand.remove(playerUuid);
    }

    public void putToTable(Integer place, List<UUID> cardUuids) {
        cardsTable.put(place, cardUuids);
    }

    public List<UUID> getFromTable(Integer place) {
        List<UUID>cardUuids = cardsTable.get(place);
        if ( cardUuids == null )
            cardUuids = new ArrayList<>();
        return cardUuids;
    }

    public UUID showBottomCardOfStock() {
        return cardsStock.get(cardsStock.size() - 1);
    }

    public Card.Back showBackOfTopOfStock() {
        return getCard(cardsStock.get(0)).getBack();
    }


    public int getNextTablePosition() {
        int position = -1;

        do {
            position ++;
        } while ( cardsTable.get(position) != null );

        return position;
    }

    // test purposes, to assert the consistency of the deck
    public Long getNumberOfCards(String suit, String rank, String back, String specialType) {
        return
            cardsStock.stream().filter(cardUuid -> {
                return getCard(cardUuid).selector(suit, rank, back, specialType);
            } ).count()
        +
            cardsTable.entrySet().stream()
                    .flatMap( e1 -> e1.getValue().stream())
                    .filter(cardUuid -> {
                        return getCard(cardUuid).selector(suit, rank, back, specialType);
                    }).count()
        +
            cardsHand.entrySet().stream()
                    .flatMap( e1 -> e1.getValue().stream())
                    .filter(cardUuid -> {
                        return getCard(cardUuid).selector(suit, rank, back, specialType);
                    }).count()
        ;
    }

    /* only for test purposes */
    public UUID getUUIDfromCard(Card card, List<UUID> notThese) {
        return cardUuids.entrySet().stream().filter(uuidCardEntry -> {
                return uuidCardEntry.getValue().equals(card) && ! notThese.contains(uuidCardEntry.getKey()) ;
            }).findAny()
            .map(uuidCardEntry -> uuidCardEntry.getKey())
                .orElseThrow(() -> new CardsException(HttpStatus.CONFLICT, "getUUIDfromCard, card not found : " + card));
    }
}

