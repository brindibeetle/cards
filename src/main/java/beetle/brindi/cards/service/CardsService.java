package beetle.brindi.cards.service;

import beetle.brindi.cards.CardsSingleton;
import beetle.brindi.cards.domain.Card;
import beetle.brindi.cards.domain.DeckBuilder;
import beetle.brindi.cards.domain.Game;
import beetle.brindi.cards.domain.GameType;
import beetle.brindi.cards.domain.Player;
import beetle.brindi.cards.domain.Players;
import beetle.brindi.cards.dto.DTOcard;
import beetle.brindi.cards.dto.DTOcards;
import beetle.brindi.cards.dto.DTOgame;
import beetle.brindi.cards.dto.DTOputCard;
import beetle.brindi.cards.exception.CardsException;
import beetle.brindi.cards.repository.CardsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CardsService {

    // instantiated by Lombok (RequiredArgsConstructor)
    private final CardsRepository cardsRepository;

    public DTOgame createGame(GameType gameType, String playerName) {

        Player firstPlayer = new Player ( playerName );
        UUID playerUUID = UUID.randomUUID();
        UUID gameUUID = UUID.randomUUID();

        Game game = null;
        switch (gameType) {
            case JOKEREN:
                game = Game.builder()
                        .players(new Players(playerUUID,  firstPlayer ))
                        .deck(new DeckBuilder()
                                .addAllRanks()
                                .addAllSuits()
                                .addAllBacks()
                                .addRegulars()
                                .addAllSpecialTypes()
                                .addSpecials()
                                .shuffle()
                                .build())
                        .build();
                break;
        }

        CardsSingleton.INSTANCE.getGames().getGames().put(gameUUID, game);

        return new DTOgame( gameUUID, game );
    }

    private Game getGame (UUID gameUuid) {
        CardsSingleton singleton = CardsSingleton.INSTANCE.getInstance();
        Game game = singleton.getGames().get( gameUuid );
        if ( game == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "Game not found");
        }
        return game;
    }
    private Player getPlayer (Game game, UUID playerUuid) {
        CardsSingleton singleton = CardsSingleton.INSTANCE.getInstance();
        Player player = game.getPlayers().get( playerUuid );
        if ( player == null ) {
            throw new CardsException(HttpStatus.NOT_FOUND, "player not found");
        }
        return player;
    }
    public DTOcards deal(GameType gameType, UUID gameUuid, UUID playerUuid) {
        Game game = getGame( gameUuid );
        Player player = getPlayer(game,  playerUuid );

        List<Card> cards = null;
        switch (gameType) {
            case JOKEREN:
                cards = game.dealCards(13);
        }

        return new DTOcards(cards);
    }

    public DTOcard draw(GameType jokeren, UUID gameUuid, UUID playerUuid) {
        Game game = getGame( gameUuid );
        Player player = getPlayer(game,  playerUuid );

        return new DTOcard( game.drawCard() );
    }

    public DTOcard put(GameType jokeren, DTOputCard dtoPutCard) {
        Game game = getGame( dtoPutCard.getGameUuid() );
        Player player = getPlayer( game, dtoPutCard.getPlayerUuid() );

        return new DTOcard ( game.putCard(dtoPutCard.makeCard() ));
    }
}
