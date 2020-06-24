package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Player {

    private String name;

    private String sessionId;

    private Status status;

    public enum Status {
        PLAYING,
        DISCONNECTED,
        FINISHED
    }

    public boolean isActive(){
        return status == Status.PLAYING;
    }
}
