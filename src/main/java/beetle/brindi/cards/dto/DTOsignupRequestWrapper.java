package beetle.brindi.cards.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DTOsignupRequestWrapper {

    private UUID playerUuid;

    private DTOsignupRequest signupRequest;

}
