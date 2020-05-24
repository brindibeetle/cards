package beetle.brindi.cards.controller;

import beetle.brindi.cards.dto.DTOcardsRequest;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOhandResponse;
import beetle.brindi.cards.dto.DTOplayerIdentifierRequest;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.service.CardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class CardsController {

    private final CardsService cardsService;

//    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;

    @CrossOrigin
    @MessageMapping("/create")
    public void createGameJokeren(@RequestParam DTOplayerIdentifierRequest playerIdentifier) {
        try {
            DTOgame dtoGame = cardsService.createGame(playerIdentifier);
            UUID playerUuid = playerIdentifier.getPlayerUuid();

            simpMessagingTemplate.convertAndSend("/created/" + playerUuid.toString(), dtoGame);
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

    @CrossOrigin
    @SendTo("/played")
    @MessageMapping("/play")
    public DTOhandResponse play(@RequestParam DTOcardsRequest cardsRequest) {
        try {
            DTOhandResponse response = cardsService.play(cardsRequest);
            return response;
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

//    @GetMapping(value = "/jokeren/draw", produces = MediaType.APPLICATION_JSON_VALUE )
//    public DTOcard drawJokeren(@RequestParam UUID gameUuid, @RequestParam UUID playerUuid) {
//        try {
//            return cardsService.draw( JOKEREN, gameUuid, playerUuid);
//        }
//        catch (CardsException ce) {
//            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
//        }
//    }
//
//    @PostMapping(value = "/jokeren/put", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE )
//    public DTOcard putJokeren(@RequestBody DTOputCard dtoPutCard) {
//        try {
//            return cardsService.put( JOKEREN, dtoPutCard );
//        }
//        catch (CardsException ce) {
//            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
//        }
//    }

}
