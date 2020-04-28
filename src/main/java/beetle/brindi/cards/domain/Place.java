package beetle.brindi.cards.domain;

public enum Place {

    STOCK
//    , STACK  basically the bottom of the STOCK
    , TABLE
    , HAND;

    public static Place defaultPlace() {
        return STOCK;
    }
}
