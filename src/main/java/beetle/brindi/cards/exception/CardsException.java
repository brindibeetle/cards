package beetle.brindi.cards.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@EqualsAndHashCode
public class CardsException extends RuntimeException {

    private final HttpStatus status;

    private final String message;

}
