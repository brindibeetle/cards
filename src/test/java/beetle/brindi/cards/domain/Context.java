package beetle.brindi.cards.domain;

import io.cucumber.core.exception.CucumberException;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class Context {

    protected Map<String, Object> context;
    protected Map<String, ContextKind> contextKind;

    public enum ContextKind {
        GAME,
        PLAYER,
        PLAYERS,
        SESSION,
        STRING,
        TABLE,
        TOPCARDBACK,
        BOTTOMCARD

    }

    public Context() {
        context = new HashMap<>();
        contextKind = new HashMap<>();
    }

    public void put(String key, ContextKind contextKind, Object object) {
        this.context.put(key, object);
        this.contextKind.put(key, contextKind);
    }
    public void put(ContextKind contextKind, Object object) {
        String key = contextKind.toString();
        this.context.put(key, object);
        this.contextKind.put(key, contextKind);
    }

    public Object get(String key, ContextKind contextKind) {
        if (contextKind.equals(this.contextKind.get(key))) {
            return context.get(key);
        } else {
            String error = "Requested key: " + key + " , of kind " + contextKind.toString() + " , but the kind actually is : " + this.contextKind.get(key);
            log.error(error);
            throw new CucumberException(error);
        }
    }

}
