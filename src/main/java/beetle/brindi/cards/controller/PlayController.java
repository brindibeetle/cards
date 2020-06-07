package beetle.brindi.cards.controller;

import beetle.brindi.cards.dto.DTOhandResponse;
import beetle.brindi.cards.dto.DTOplayRequest;
import beetle.brindi.cards.dto.DTOplayResponse;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.response.GameResponse;
import beetle.brindi.cards.response.PlayingResponse;
import beetle.brindi.cards.service.PlayService;
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
public class PlayController {

    private final PlayService playService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
//    @SendTo("/played")
    @MessageMapping("/play")
    public void play(@RequestParam DTOplayRequest playRequest) {
        try {
            UUID gameUuid = playRequest.getGameUuid();
            UUID playerUuid = playRequest.getPlayerUuid();

            PlayingResponse playingResponse = playService.play(playRequest);

            DTOplayResponse playResponse = playingResponse.getDtoPlayResponse();
            if (playResponse != null) {
                simpMessagingTemplate.convertAndSend("/played/" + gameUuid.toString(), playResponse);
            }

            DTOhandResponse handResponse = playingResponse.getDtoHandResponse();
            if (handResponse != null) {
                simpMessagingTemplate.convertAndSend("/handed/" + playerUuid.toString(), handResponse);
            }

            GameResponse gameResponse = playingResponse.getGameResponse();
            if (handResponse != null) {
                simpMessagingTemplate.convertAndSend("/game/" + gameUuid.toString(), gameResponse);
            }
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }
}
