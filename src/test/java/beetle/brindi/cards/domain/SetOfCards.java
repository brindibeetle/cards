package beetle.brindi.cards.domain;

import beetle.brindi.cards.dto.DTOcard;
import io.cucumber.datatable.DataTable;
import io.cucumber.datatable.TableTransformer;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SetOfCards {

    private List<DTOcard>cards = new ArrayList<>();

    public void addCard(DTOcard card) {
        cards.add(card);
    }

    public static class CardsTransformer implements TableTransformer<SetOfCards> {

        @Override
        public SetOfCards transform(DataTable table) throws Throwable {

            SetOfCards cards = new SetOfCards();

            table.cells()
                    .stream()
//                .skip(1)        // Skip header row
                    .map(fields -> new DTOcard(fields.get(0), fields.get(1), fields.get(2), fields.get(3)))
                    .forEach(cards::addCard);

            return cards;
        }
    }
}

