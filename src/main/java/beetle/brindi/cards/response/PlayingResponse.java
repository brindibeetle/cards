package beetle.brindi.cards.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayingResponse {

    private Optional<PlayResponse> playResponse;

    private Optional<HandResponse> handResponse;

    private Optional<GameResponse> gameResponse;

}
