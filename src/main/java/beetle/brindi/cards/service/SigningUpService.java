package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Deck;
import beetle.brindi.cards.domain.DeckBuilder;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.request.SigningUpRequest;
import beetle.brindi.cards.response.SigningUpResponse;
import beetle.brindi.cards.response.SignupAllResponse;
import beetle.brindi.cards.response.SignupPersonalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SigningUpService {

    private final GamesService gamesService;

    private final PlayersService playersService;

    public SigningUpResponse signup(SigningUpRequest signupRequest, String sessionId) {
        UUID gameUuid = signupRequest.getGameUuid();
        String gameName = signupRequest.getGameName();
        UUID playerUuid = signupRequest.getPlayerUuid();
        SigningUpRequest.TypeRequest typeRequest = signupRequest.getTypeRequest();

        Optional<SignupAllResponse> signupAllResponse = Optional.empty();
        Optional<SignupPersonalResponse> signupPersonalResponse = Optional.empty();

        switch (typeRequest) {
            case GAMES_AND_PLAYERS:
                signupPersonalResponse = Optional.of(
                        SignupPersonalResponse.builder()
                                .typeResponse(SignupPersonalResponse.TypeResponse.GAMES_AND_PLAYERS)
                                .games(gamesService.getGames())
                                .playerUuid(playerUuid.toString())
                                .build()
                );
                return new SigningUpResponse(signupAllResponse, signupPersonalResponse);

            case CREATE:
                DTOgame game = createGame(signupRequest, sessionId);
                signupPersonalResponse = Optional.of(
                        SignupPersonalResponse.builder()
                                .typeResponse(SignupPersonalResponse.TypeResponse.CREATE)
                                .gameUuid(game.getGameUuid().toString())
                                .playerUuid(playerUuid.toString())
                                .build()
                );
                signupAllResponse = Optional.of(
                        SignupAllResponse.builder()
                                .typeResponse(SignupAllResponse.TypeResponse.GAMES_AND_PLAYERS)
                                .games(gamesService.getGames())
                                .build()
                );
                return new SigningUpResponse(signupAllResponse, signupPersonalResponse);

            case JOIN:
                joinGame(signupRequest, sessionId);
                signupPersonalResponse = Optional.of(
                        SignupPersonalResponse.builder()
                                .typeResponse(SignupPersonalResponse.TypeResponse.JOIN)
                                .gameUuid(gameUuid.toString())
                                .playerUuid(playerUuid.toString())
                                .build()
                );
                signupAllResponse = Optional.of(
                        SignupAllResponse.builder()
                                .typeResponse(SignupAllResponse.TypeResponse.GAMES_AND_PLAYERS)
                                .games(gamesService.getGames())
                                .build()
                );
                return new SigningUpResponse(signupAllResponse, signupPersonalResponse);

            case START:
                signupAllResponse = Optional.of(
                        SignupAllResponse.builder()
                                .typeResponse(SignupAllResponse.TypeResponse.START)
                                .gameUuid(signupRequest.getGameUuid().toString())
                                .build()
                );
                return new SigningUpResponse(signupAllResponse, signupPersonalResponse);

            default:
                throw new CardsException(HttpStatus.CONFLICT, "Undefined typeRequest : " + typeRequest);

        }
    }

    private void joinGame(SigningUpRequest signupRequest, String sessionId) {
        UUID gameUuid = signupRequest.getGameUuid();
        UUID playerUuid =  signupRequest.getPlayerUuid();
        String playerName = signupRequest.getPlayerName();
        playersService.addPlayer(gameUuid, playerUuid, playerName, sessionId);
    }

    public DTOgame createGame(SigningUpRequest signupRequest, String sessionId) {

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

    public void flush() {
        CardsSingleton.getInstance().getGames().getGames().clear();
    }

}