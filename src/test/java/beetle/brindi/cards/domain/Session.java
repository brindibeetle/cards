package beetle.brindi.cards.domain;

import beetle.brindi.cards.dto.DTOcard;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
//@AllArgsConstructor
public class Session {

    String sessionId;

    UUID playerUuid;

    List<DTOcard> cards;

    public Session(String sessionId, UUID playerUuid) {
        this.sessionId = sessionId;
        this.playerUuid = playerUuid;
        this.cards = new ArrayList<>();
    }

}
