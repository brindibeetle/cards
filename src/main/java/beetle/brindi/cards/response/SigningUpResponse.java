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
public class SigningUpResponse {

    private Optional<SignupAllResponse> signupAllResponse;

    private Optional<SignupPersonalResponse> signupPersonalResponse;

}
