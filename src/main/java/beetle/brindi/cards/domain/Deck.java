package beetle.brindi.cards.domain;

import beetle.brindi.cards.exception.CardsException;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;

@Data
@AllArgsConstructor
public class Deck {

//    private Map<Place, List<Card>> cards;

    private List<Card> cardsStock;
    private Map<Integer, List<Card>> cardsTable;
    private Map<UUID, Set<Card>> cardsHand;

    public Deck() {
        cardsStock = new ArrayList<>();
        cardsTable = new HashMap<>();
        cardsHand = new HashMap<>();
    }
    public Deck(List<Card> cards) {
        this();
        this.cardsStock = cards;
    }

    /*
        Cards on each place are treated as fifo-stacks.
        Cards are taken from the "top"-side and put back at the "bottom"-side.
        As cards are represented as List, the top-side is 0, and the bottom is List.size()-1.
    */
    public List<Card> takeFromStock( int number ) {
        List<Card> takenCards =
                IntStream.range(0, number)
                .mapToObj(cardsStock::get)
                .collect(toList());

        cardsStock =
                IntStream.range(number, cardsStock.size() )
                        .mapToObj(cardsStock::get)
                        .collect(toList());

        return takenCards;
    }

    public List<Card> takeFromStockBottom( int number) {
        List<Card> takenCards =
                IntStream.range(0, number)
                        .mapToObj(i -> cardsStock.get(cardsStock.size() - 1 - i))
                        .collect(toList());
        cardsStock =
                IntStream.range(0, cardsStock.size() - number )
                        .mapToObj(cardsStock::get)
                        .collect(toList());

        return takenCards;
    }

    public void putToStock(List<Card> cards) {
        // cards are added to the "bottom"
        List<Card> cardsStockBecomes = new ArrayList<>(cardsStock);
        cardsStockBecomes.addAll(cards);
        cardsStock = cardsStockBecomes;
    }

    public void takeFromHand(UUID playerUuid, List<Card> cards ) {
        Set<Card> cardsPlayer = cardsHand.get(playerUuid);

        List<Card> notFound = cards.stream().filter( card -> ! cardsPlayer.contains( card )).collect(toList());

        if ( ! notFound.isEmpty() )
            throw new CardsException(HttpStatus.CONFLICT, "These cards are not present in the players hand, player : " + playerUuid + ", cards : " + notFound );

        cardsPlayer.removeAll(cards);
    }

    public void putToHand(UUID playerUuid, List<Card> cards ) {
        cardsHand.get(playerUuid).addAll(cards);
    }
    public void addPlayer(UUID playerUuid) {
        cardsHand.put(playerUuid, new HashSet<>());
    }

    public void putToTable(Integer place, List<Card> cards) {
        cardsTable.put(place, cards);
    }

    public Card showBottomCardOfStock() {
        return cardsStock.get(cardsStock.size() - 1);
    }

    public Card.Back showBackOfTopOfStock() {
        return cardsStock.get(0).getBack();
    }
}

