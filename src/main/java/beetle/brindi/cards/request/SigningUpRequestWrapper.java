package beetle.brindi.cards.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SigningUpRequestWrapper {

    private UUID playerUuid;

    private SigningUpRequest signupRequest;

}
