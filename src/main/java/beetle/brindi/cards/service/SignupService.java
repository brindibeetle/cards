package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.DeckBuilder;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.request.SignupRequest;
import beetle.brindi.cards.response.SignupResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final GamesService serviceHelper;

    private final PlayersService playersService;

    public Optional<SignupResponse> signingin(SignupRequest signupRequest) {
        SignupRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        switch (typeRequest) {
            case START:
                return Optional.of(
                    SignupResponse.builder()
                        .typeResponse(SignupResponse.TypeResponse.START)
                        .gameUuid(signupRequest.getGameUuid().toString())
                        .playerUuid(signupRequest.getPlayerUuid().toString())
                        .build()
                );

            default:
                return Optional.of(
                    SignupResponse.builder()
                        .typeResponse(SignupResponse.TypeResponse.GAMES)
                        .games(serviceHelper.getGames())
                        .build()
                );
        }
    }

    public Optional<SignupResponse> signup(SignupRequest signupRequest, String sessionId) {

        UUID gameUuid = signupRequest.getGameUuid();
        String gameName = signupRequest.getGameName();
        UUID playerUuid = signupRequest.getPlayerUuid();
        SignupRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        switch (typeRequest) {
            case GAMES:
                return Optional.of(
                    SignupResponse.builder()
                        .typeResponse(SignupResponse.TypeResponse.GAMES)
                        .games(serviceHelper.getGames())
                        .playerUuid(playerUuid.toString())
                        .build()
                );

            case CREATE:
                DTOgame game = createGame(signupRequest, sessionId);
                return Optional.of(
                    SignupResponse.builder()
                        .typeResponse(SignupResponse.TypeResponse.CREATE)
                        .gameUuid(game.getGameUuid().toString())
                        .playerUuid(playerUuid.toString())
                        .build()
                );

            case JOIN:
                joinGame(signupRequest, sessionId);
                return Optional.of(
                    SignupResponse.builder()
                        .typeResponse(SignupResponse.TypeResponse.JOIN)
                        .gameUuid(gameUuid.toString())
                        .playerUuid(playerUuid.toString())
                        .build()
                );

            case START:
                return Optional.empty();

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Unknown TypeRequest, typeRequest = " + typeRequest) ;
        }
    }

    private void joinGame(SignupRequest signupRequest, String sessionId) {
        UUID gameUuid = signupRequest.getGameUuid();
        UUID playerUuid =  signupRequest.getPlayerUuid();
        String playerName = signupRequest.getPlayerName();
        playersService.addPlayer(gameUuid, playerUuid, playerName, sessionId);
    }

    public DTOgame createGame(SignupRequest signupRequest, String sessionId) {

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

        UUID gameUuid = UUID.randomUUID();
        UUID playerUuid =  signupRequest.getPlayerUuid();
        String playerName = signupRequest.getPlayerName();

//        game.addPlayer(playerName, sessionId, playerUuid);

        game.setName(signupRequest.getGameName());
        game.setStarted(Boolean.FALSE);

        CardsSingleton.getInstance().getGames().getGames().put(gameUuid, game);
        playersService.addPlayer(gameUuid, playerUuid, playerName, sessionId);
        game.setCreator(playerUuid);

        return new DTOgame( gameUuid, game );
    }

}