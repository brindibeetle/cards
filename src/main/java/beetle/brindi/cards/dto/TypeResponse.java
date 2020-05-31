package beetle.brindi.cards.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public enum TypeResponse {
    PUT_ON_TABLE,
    SLIDE_ON_TABLE,
    PUT_ON_STACK_BOTTOM,
    GET,
    DEAL,
    START;
}
