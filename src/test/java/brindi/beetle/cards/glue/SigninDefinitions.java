package brindi.beetle.cards.glue;


import beetle.brindi.cards.request.SigningUpRequest;
import beetle.brindi.cards.request.SigningUpRequestWrapper;
import beetle.brindi.cards.response.SigningUpResponse;
import beetle.brindi.cards.response.SignupPersonalResponse;
import io.cucumber.java8.En;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageHeaders;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.UUID;

public class SigninDefinitions extends AbstractDefinitions implements En {

    private final String baseUrl = "ws://localhost:8080/cards-ws";

    public SigninDefinitions() {
        context = new HashMap<>();

            Given("player connects the game", () -> {

                UUID playerUuid = UUID.randomUUID();
                context.put("playerUuid", playerUuid);
                SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                        .playerUuid(playerUuid)
                        .signupRequest(SigningUpRequest.builder()
                                .playerUuid(playerUuid)
                                .playerName("")
                                .gameName("")
                                .typeRequest(SigningUpRequest.TypeRequest.GAMES_AND_PLAYERS)
                                .build()
                        ).build();
                MessageHeaders messageHeaders = new MessageHeaders(new HashMap<String, Object>());
                SigningUpResponse signingUpResponse = signingUpController.signup(signingUpRequestWrapper, messageHeaders);

            });
//        Given("player with name (.+) creates game with name (.+)", (String playerName, String gameName) -> {
            Given("player with name Pipo creates game with name Circus", () -> {

            String playerName = "Pipo";
            String gameName = "Circus";
            UUID playerUuid = UUID.randomUUID();
            UUID gameUuid = UUID.randomUUID();

            SigningUpRequestWrapper signingUpRequestWrapper = SigningUpRequestWrapper.builder()
                    .playerUuid(playerUuid)
                    .signupRequest(SigningUpRequest.builder()
                            .playerUuid(playerUuid)
                            .playerName(playerName)
                            .gameUuid(gameUuid)
                            .gameName(gameName)
                            .typeRequest(SigningUpRequest.TypeRequest.CREATE)
                            .build()
                    ).build();

            ResponseEntity<SignupPersonalResponse> signupPersonalResponseResponseEntity = new RestTemplate().getForEntity(baseUrl + "/cards/v1/signup", SignupPersonalResponse.class);
        });
    }
}
