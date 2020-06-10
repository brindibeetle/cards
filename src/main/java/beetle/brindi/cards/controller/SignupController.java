package beetle.brindi.cards.controller;

import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.request.SignupRequest;
import beetle.brindi.cards.request.SignupRequestWrapper;
import beetle.brindi.cards.service.PlayService;
import beetle.brindi.cards.service.SignupService;
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
public class SignupController {

    private final SignupService signupService;

    private final PlayService playService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
    @MessageMapping("/signup")
    public void signup(@RequestParam SignupRequestWrapper signupRequestWrapper, MessageHeaders messageHeaders) {
        try {
            UUID playerUuid = signupRequestWrapper.getPlayerUuid();

            SignupRequest signupRequest = signupRequestWrapper.getSignupRequest();
            signupRequest.setPlayerUuid(playerUuid);
            String sessionId = messageHeaders.get("simpSessionId").toString();

            signupService.signup(signupRequest, sessionId).ifPresent(
                signupResponse ->
                    simpMessagingTemplate.convertAndSend("/signedup/" + playerUuid.toString(), signupResponse)
            );

            signupService.signingin(signupRequest).ifPresent(
                signinginResponse ->
                    simpMessagingTemplate.convertAndSend("/signingin/", signinginResponse)
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


}
