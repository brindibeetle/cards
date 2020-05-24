package beetle.brindi.cards.controller;

import beetle.brindi.cards.dto.DTOplayRequest;
import beetle.brindi.cards.dto.DTOplayResponse;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.service.PlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class PlayController {

    private final PlayService playService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
//    @SendTo("/played")
    @MessageMapping("/play")
    public void play(@RequestParam DTOplayRequest playRequest) {
        try {
            UUID gameUuid = playRequest.getGameUuid();

            DTOplayResponse playResponse = playService.play(playRequest);
            simpMessagingTemplate.convertAndSend("/played/" + gameUuid.toString(), playResponse);
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }
}
