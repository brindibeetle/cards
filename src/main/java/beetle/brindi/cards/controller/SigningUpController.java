package beetle.brindi.cards.controller;

import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.request.SigningUpRequest;
import beetle.brindi.cards.request.SigningUpRequestWrapper;
import beetle.brindi.cards.response.SigningUpResponse;
import beetle.brindi.cards.service.PlayService;
import beetle.brindi.cards.service.SigningUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class SigningUpController {

    private final SigningUpService signingUpService;

    private final PlayService playService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
    @MessageMapping("/signup")
    public void signup(@RequestParam SigningUpRequestWrapper signupRequestWrapper, MessageHeaders messageHeaders) {
        try {
            UUID playerUuid = signupRequestWrapper.getPlayerUuid();

            SigningUpRequest signupRequest = signupRequestWrapper.getSignupRequest();
            signupRequest.setPlayerUuid(playerUuid);
            String sessionId = messageHeaders.get("simpSessionId").toString();

            SigningUpResponse signingUpResponse = signingUpService.signup(signupRequest, sessionId);

            signingUpResponse.getSignupPersonalResponse().ifPresent(
                signupPersonalResponse ->
                    simpMessagingTemplate.convertAndSend("/signedupPersonal/" + playerUuid.toString(), signupPersonalResponse)
            );

            signingUpResponse.getSignupAllResponse().ifPresent(
                signupAllResponse ->
                    simpMessagingTemplate.convertAndSend("/signedupAll/", signupAllResponse)
            );

            playService.startGame(signupRequest).ifPresent(
                playResponse ->
                {
                    UUID gameUuid = signupRequest.getGameUuid();
                    simpMessagingTemplate.convertAndSend("/played/" + gameUuid.toString(), playResponse);
                }
            );
        }

        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

    public void signupEvent(SigningUpResponse signingUpResponse, UUID playerUuid ) {
        try {
            signingUpResponse.getSignupPersonalResponse().ifPresent(
                    signupPersonalResponse ->
                            simpMessagingTemplate.convertAndSend("/signedupPersonal/" + playerUuid.toString(), signupPersonalResponse)
            );

            signingUpResponse.getSignupAllResponse().ifPresent(
                    signupAllResponse ->
                            simpMessagingTemplate.convertAndSend("/signedupAll/", signupAllResponse)
            );

        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

}
