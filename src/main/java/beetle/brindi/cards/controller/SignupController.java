package beetle.brindi.cards.controller;

import beetle.brindi.cards.dto.DTOplayResponse;
import beetle.brindi.cards.dto.DTOsignupRequest;
import beetle.brindi.cards.dto.DTOsignupRequestWrapper;
import beetle.brindi.cards.dto.DTOsignupResponse;
import beetle.brindi.cards.exception.CardsException;
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
    public void signup(@RequestParam DTOsignupRequestWrapper signupRequestWrapper, MessageHeaders messageHeaders) {
        try {
            UUID playerUuid = signupRequestWrapper.getPlayerUuid();

            DTOsignupRequest signupRequest = signupRequestWrapper.getSignupRequest();
            signupRequest.setPlayerUuid(playerUuid);
            String sessionId = messageHeaders.get("simpSessionId").toString();

            DTOsignupResponse signupResponse = signupService.signup(signupRequest, sessionId);
            if (signupResponse != null) {
                simpMessagingTemplate.convertAndSend("/signedup/" + playerUuid.toString(), signupResponse);
            }

            DTOsignupResponse signinginResponse = signupService.signingin(signupRequest);
            if (signinginResponse != null) {
                simpMessagingTemplate.convertAndSend("/signingin/", signinginResponse);
            }

            DTOplayResponse playResponse = playService.startGame(signupRequest);
            if (playResponse != null) {
                UUID gameUuid = signupRequest.getGameUuid();
                simpMessagingTemplate.convertAndSend("/played/" + gameUuid.toString(), playResponse);
            }
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }


}
