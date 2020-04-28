package beetle.brindi.cards.repository;

import beetle.brindi.cards.domain.Deck;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardsRepository extends MongoRepository<Deck, Integer> {

//    Sudoku findById(Integer id);
}
