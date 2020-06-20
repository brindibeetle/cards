package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class Sessions {

    private Map<String, Session> sessions;
    private String currSession;

    public Sessions(){
        sessions = new HashMap<>();
        currSession = "";
    }

    public void addSession(String playerName, Session session){
        if (sessions.containsKey(playerName)) {
            throw new RuntimeException("Exists already");
        }
        else {
            sessions.put(playerName, session);
            currSession = playerName;
        }
    }

    public Session getSession(String playerName) {
        return sessions.get(playerName);
    }

    public void setCurrentSession(String playerName) {
        currSession = playerName;
    }

    public Session getCurrentSession() {
        return sessions.get(currSession);
    }

    public String getCurrentPlayerName() {
        return currSession;
    }

}
