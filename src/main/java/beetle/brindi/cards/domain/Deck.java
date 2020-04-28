package beetle.brindi.cards.domain;

import beetle.brindi.cards.exception.CardsException;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;

@Data
@AllArgsConstructor
public class Deck {

    private Map<Place, List<Card>> cards;

    public Deck() {
        cards = new HashMap<>();
        for (Place place : Place.values()) {
            cards.put(place, new ArrayList<>() );
        }
    }
    public Deck(List<Card> cards) {
        this();
        this.cards.put(Place.STOCK, cards);
    }

    /*
        Cards on each place are treated as fifo-stacks.
        Cards are taken from the "top"-side and put back at the "bottom"-side.
        As cards are represented as List, the top-side is 0, and the bottom is List.size().
    */
    public List<Card> take( int number, Place from, Place to ) {
        if ( from == to )
        {
            throw new CardsException(HttpStatus.CONFLICT, "Deck.take( int number, Place from, Place to ) from <> to , from = to = " + from.toString());
        }
        List<Card> fromCards = cards.get(from);
        // cards are taken from the "top"
        List<Card> takenCards =
                IntStream.range(0, number)
                .mapToObj(i -> fromCards.get(i))
                .collect(toList());
        List<Card>fromCardsLeftOver =
                IntStream.range(number, fromCards.size() )
                        .mapToObj(i -> fromCards.get(i))
                        .collect(toList());
        // cards are added to the "bottom"
        List<Card> toCardsBecome = takenCards;
        toCardsBecome.addAll(cards.get(to));

        cards.put(from, fromCardsLeftOver);
        cards.put(to, toCardsBecome);
        return takenCards;
    }

    public Card take( Card card, Place from, Place to ) {
        if ( from == to )
        {
            throw new CardsException(HttpStatus.CONFLICT, "Deck.take( Card card, Place from, Place to ) from <> to , from = to = " + from.toString());
        }
        if (! cards.get(from).contains(card)) {
            throw new CardsException(HttpStatus.CONFLICT
                    , "Deck.take( Card card, Place from, Place to ) card " + card.toString() + " not present in " + from.toString());
        }
        List<Card>fromCardsLeftOver = cards.get(from).stream()
                .filter(card1 -> ! card1.equals(card))
                .collect(toList());
        // cards are added to the "bottom"
        List<Card> toCardsBecome = new ArrayList<>();
        toCardsBecome.add(card);
        toCardsBecome.addAll(cards.get(to));

        cards.put(from, fromCardsLeftOver);
        cards.put(to, toCardsBecome);
        return card;
    }
}

