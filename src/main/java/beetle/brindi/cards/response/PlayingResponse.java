package beetle.brindi.cards.response;

import beetle.brindi.cards.dto.DTOhandResponse;
import beetle.brindi.cards.dto.DTOplayResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayingResponse {

    private DTOplayResponse dtoPlayResponse;

    private DTOhandResponse dtoHandResponse;

    private GameResponse gameResponse;

}
