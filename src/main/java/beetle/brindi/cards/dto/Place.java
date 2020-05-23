package beetle.brindi.cards.dto;

public enum Place {

    STACKBOTTOM,
    STACKTOP,
    TABLE;

    public static Place defaultPlace() {
        return STACKBOTTOM;
    }
}