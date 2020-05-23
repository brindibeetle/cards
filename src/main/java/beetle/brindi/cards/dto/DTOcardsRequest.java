package beetle.brindi.cards.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DTOcardsRequest {

    private TypeRequest typeRequest;

    private UUID gameUuid;

    private UUID playerUuid;

    private List<DTOcard> cards;

    private Integer handPosition;

    private Integer tablePosition;

    private Place place;

    public enum TypeRequest {
        GET,
        PUT,
        DEAL,
        SLIDE;

    }
}
