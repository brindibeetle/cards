package brindi.beetle.cards.glue;

import beetle.brindi.cards.controller.SigningUpController;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class AbstractDefinitions {

    protected final SigningUpController signingUpController;

    protected Map<String, Object> context;

//    protected AbstractDefinitions() {
//    }
}
