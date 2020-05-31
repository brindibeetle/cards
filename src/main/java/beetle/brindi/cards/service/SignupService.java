package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.DeckBuilder;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOsignupRequest;
import beetle.brindi.cards.dto.DTOsignupResponse;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.repository.CardsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final ServiceHelper serviceHelper;

    private final CardsRepository cardsRepository;

    public DTOsignupResponse signingin(DTOsignupRequest signupRequest) {
        DTOsignupRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        switch (typeRequest) {
            case START:
                return DTOsignupResponse.builder()
                                .typeResponse(DTOsignupResponse.TypeResponse.START)
                                .gameUuid(signupRequest.getGameUuid().toString())
                                .playerUuid(signupRequest.getPlayerUuid().toString())
                                .build();

            default:
                return DTOsignupResponse.builder()
                                .typeResponse(DTOsignupResponse.TypeResponse.GAMES)
                                .games(serviceHelper.getGames())
                                .build();
        }
    }

    public DTOsignupResponse signup(DTOsignupRequest signupRequest) {

        UUID gameUuid = signupRequest.getGameUuid();
        String gameName = signupRequest.getGameName();
        UUID playerUuid = signupRequest.getPlayerUuid();
        DTOsignupRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        switch (typeRequest) {
            case GAMES:
                return DTOsignupResponse.builder()
                        .typeResponse(DTOsignupResponse.TypeResponse.GAMES)
                        .games(serviceHelper.getGames())
                        .playerUuid(playerUuid.toString())
                        .build();

            case CREATE:
                DTOgame game = createGame(signupRequest);
                return DTOsignupResponse.builder()
                        .typeResponse(DTOsignupResponse.TypeResponse.CREATE)
                        .gameUuid(game.getGameUuid().toString())
                        .playerUuid(playerUuid.toString())
                        .build();

            case JOIN:
                joinGame(signupRequest);
                return DTOsignupResponse.builder()
                        .typeResponse(DTOsignupResponse.TypeResponse.JOIN)
                        .gameUuid(gameUuid.toString())
                        .playerUuid(playerUuid.toString())
                        .build();

            case START:
                return null;

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Unknown TypeRequest, typeRequest = " + typeRequest) ;
        }
    }

    private void joinGame(DTOsignupRequest signupRequest) {
        Game game = serviceHelper.getGame(signupRequest.getGameUuid());
        UUID playerUuid =  signupRequest.getPlayerUuid();
        game.addPlayer(signupRequest.getPlayerName(), playerUuid);

    }

    public DTOgame createGame(DTOsignupRequest signupRequest) {

        UUID gameUUID = UUID.randomUUID();

        Deck deck = new DeckBuilder()
                .addAllRanks()
                .addAllSuits()
                .addAllBacks()
                .addRegulars()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addAllSpecialTypes()
                .addSpecials()
                .shuffle()
                .build();

        Game game = new Game(deck);

        UUID playerUuid =  signupRequest.getPlayerUuid();
        game.addPlayer(signupRequest.getPlayerName(), playerUuid);
        game.setCreator(playerUuid);
        game.setName(signupRequest.getGameName());
        game.setStarted(Boolean.FALSE);

        CardsSingleton.getInstance().getGames().getGames().put(gameUUID, game);

        return new DTOgame( gameUUID, game );
    }

}