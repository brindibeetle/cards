package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class Session {

    String sessionId;

    UUID playerUuid;

}
