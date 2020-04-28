package beetle.brindi.cards;

import beetle.brindi.cards.domain.Games;

// reference https://www.baeldung.com/java-singleton
public enum CardsSingleton {

    INSTANCE;

    private final Games games;

    CardsSingleton() {
        games = new Games();
    }

    public static CardsSingleton getInstance() {
        return INSTANCE;
    }

    public Games getGames() {
        return games;
    }
}
