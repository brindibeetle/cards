package beetle.brindi.cards.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DTOplayHandResponse {

    private DTOplayResponse dtoPlayResponse;

    private DTOhandResponse dtoHandResponse;

}
