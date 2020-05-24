package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.DeckBuilder;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOsignupRequest;
import beetle.brindi.cards.dto.DTOsignupResponse;
import beetle.brindi.cards.repository.CardsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final ServiceHelper serviceHelper;

    private final CardsRepository cardsRepository;

    public DTOsignupResponse signup(DTOsignupRequest signupRequest) {

        UUID gameUuid = signupRequest.getGameUuid();
        UUID playerUuid = signupRequest.getPlayerUuid();
        DTOsignupRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        DTOsignupResponse signupResponse = null;
        switch (typeRequest) {
            case CREATE:
                DTOgame game = createGame(signupRequest);
                signupResponse = DTOsignupResponse.builder()
                        .typeResponse(DTOsignupResponse.TypeResponse.CREATE)
                        .gameUuid(game.getGameUuid().toString())
                        .playerUuid(game.getPlayerUuid().toString())
                        .build();
                return signupResponse;

            case JOIN:
                joinGame(signupRequest);
                signupResponse = DTOsignupResponse.builder()
                        .typeResponse(DTOsignupResponse.TypeResponse.JOIN)
                        .gameUuid(gameUuid.toString())
                        .playerUuid(playerUuid.toString())
                        .build();
                return signupResponse;

            case GAMES:
                signupResponse = DTOsignupResponse.builder()
                        .typeResponse(DTOsignupResponse.TypeResponse.GAMES)
                        .games(serviceHelper.getGameUuids())
                        .build();
                return signupResponse;
        }
        return signupResponse;
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

        CardsSingleton.getInstance().getGames().getGames().put(gameUUID, game);

        return new DTOgame( gameUUID, game );
    }

}