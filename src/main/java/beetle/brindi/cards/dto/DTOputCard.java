package beetle.brindi.cards.dto;

import beetle.brindi.cards.domain.Card;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DTOputCard {

    private UUID gameUuid;
    private UUID playerUuid;

    private String suit;
    private String rank;
    private String back;

    private String specialType;

}
