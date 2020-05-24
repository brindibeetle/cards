package beetle.brindi.cards.controller;

import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOsignupRequest;
import beetle.brindi.cards.dto.DTOsignupRequestWrapper;
import beetle.brindi.cards.dto.DTOsignupResponse;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.service.SignupService;
import lombok.RequiredArgsConstructor;
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

    private final SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
    @MessageMapping("/signup")
    public void signup(@RequestParam DTOsignupRequestWrapper signupRequestWrapper) {
        try {
            UUID playerUuid = signupRequestWrapper.getPlayerUuid();

            DTOsignupRequest signupRequest = signupRequestWrapper.getSignupRequest();
            signupRequest.setPlayerUuid(playerUuid);

            DTOsignupResponse signupResponse = signupService.signup(signupRequest);
            simpMessagingTemplate.convertAndSend("/signedup/" + playerUuid.toString(), signupResponse);
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

}
