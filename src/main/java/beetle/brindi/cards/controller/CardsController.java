package beetle.brindi.cards.controller;

import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOcards;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOputCard;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.service.CardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import static beetle.brindi.cards.domain.GameType.JOKEREN;

@RestController
@RequestMapping("/v1/cards")
@RequiredArgsConstructor
public class CardsController {

    private final CardsService cardsService;

    @GetMapping(value = "/jokeren/new", produces = MediaType.APPLICATION_JSON_VALUE )
    public DTOgame createGameJokeren(@RequestParam String playerName ) {
        try {
            return cardsService.createGame(JOKEREN, playerName);
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

    @GetMapping(value = "/jokeren/deal", produces = MediaType.APPLICATION_JSON_VALUE )
    public DTOcards dealJokeren(@RequestParam UUID gameUuid, @RequestParam UUID playerUuid) {
        try {
            return cardsService.deal( JOKEREN, gameUuid, playerUuid);
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

    @GetMapping(value = "/jokeren/draw", produces = MediaType.APPLICATION_JSON_VALUE )
    public DTOcard drawJokeren(@RequestParam UUID gameUuid, @RequestParam UUID playerUuid) {
        try {
            return cardsService.draw( JOKEREN, gameUuid, playerUuid);
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

    @PostMapping(value = "/jokeren/put", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE )
    public DTOcard putJokeren(@RequestBody DTOputCard dtoPutCard) {
        try {
            return cardsService.put( JOKEREN, dtoPutCard );
        }
        catch (CardsException ce) {
            throw new ResponseStatusException( ce.getStatus(), ce.getMessage(), ce );
        }
    }

}
