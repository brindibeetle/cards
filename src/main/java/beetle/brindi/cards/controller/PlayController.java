package beetle.brindi.cards.controller;

import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.request.PlayRequest;
import beetle.brindi.cards.response.PlayingResponse;
import beetle.brindi.cards.service.PlayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static java.lang.Thread.sleep;

@Controller
@RequiredArgsConstructor
public class PlayController {

    private final PlayService playService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
//    @SendTo("/played")
    @MessageMapping("/play")
    public PlayingResponse play(@RequestParam PlayRequest playRequest) {
        try {
            UUID gameUuid = playRequest.getGameUuid();
            UUID playerUuid = playRequest.getPlayerUuid();

            PlayingResponse playingResponse = playService.play(playRequest);

            playingResponse.getPlayResponse().ifPresent(
                    playResponse ->
                        simpMessagingTemplate.convertAndSend("/played/" + gameUuid.toString(), playResponse)
            );
            sleep(700);

            playingResponse.getHandResponse().ifPresent(
                    handResponse ->
                        simpMessagingTemplate.convertAndSend("/handed/" + playerUuid.toString(), handResponse)
            );
            sleep(700);

            playingResponse.getGameResponse().ifPresent(
                    gameResponse ->
                        simpMessagingTemplate.convertAndSend("/game/" + gameUuid.toString(), gameResponse)
            );

            return playingResponse;
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
        catch (InterruptedException ie) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ie.getMessage());
        }
    }

    public void playEvent(PlayingResponse playingResponse, UUID gameUuid, UUID playerUuid) {

        try {
            playingResponse.getPlayResponse().ifPresent(
                    playResponse ->
                            simpMessagingTemplate.convertAndSend("/played/" + gameUuid.toString(), playResponse)
            );
            playingResponse.getHandResponse().ifPresent(
                    handResponse ->
                            simpMessagingTemplate.convertAndSend("/handed/" + playerUuid.toString(), handResponse)
            );

            playingResponse.getGameResponse().ifPresent(
                    gameResponse ->
                            simpMessagingTemplate.convertAndSend("/game/" + gameUuid.toString(), gameResponse)
            );
        }
        catch (CardsException ce) {
            throw new ResponseStatusException(ce.getStatus(), ce.getMessage(), ce);
        }
    }

}
