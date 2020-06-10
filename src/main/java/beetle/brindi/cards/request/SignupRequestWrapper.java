package beetle.brindi.cards.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestWrapper {

    private UUID playerUuid;

    private SignupRequest signupRequest;

}
