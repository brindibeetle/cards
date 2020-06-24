package beetle.brindi.cards.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Slf4j
public class Context {

    protected Map<Key, Object> context;

    public enum ContextKind {
        GAME,
        PLAYER,
        TABLE,
        TOPCARDBACK,
        BOTTOMCARD,
        CURRENTPLAYER,
        CURRENTGAME,
        SESSIONID,
        PLAYEROF,
        PLAYERCARDS
    }

    public Context() {
        context = new HashMap<>();
    }

    public void put(String id, ContextKind contextKind, Object object) {
        Key key = new Key(contextKind, id);
        this.context.put(key, object);
    }

    public Object get(String id, ContextKind contextKind) {
        Key key = new Key(contextKind, id);

        return context.get(key);
    }

    public void remove(String id, ContextKind contextKind) {
        Key key = new Key(contextKind, id);
        this.context.remove(key);
    }

    public <T extends Object> List<T> getAllOfKind(ContextKind contextKind, Class<T> type) {

        List<T> allOfKind = new ArrayList<>();
        context.forEach( (key, object) -> {
            if (key.contextKind == contextKind)
                allOfKind.add((T)object);
        });
        return allOfKind;
    }
    public List<String>  getAllIdsOfKindAndValue(ContextKind contextKind, Object value) {
        List<String> allIdsOfKindAndValue = new ArrayList<>();
        context.forEach( (key, object) -> {
            if (key.contextKind == contextKind && value.equals(object))
                allIdsOfKindAndValue.add(key.getKey());
        });
        return allIdsOfKindAndValue;
    }

    public List<String>  getAllIdsOfKind(ContextKind contextKind) {
        List<String> allIdsOfKind = new ArrayList<>();
        context.forEach( (key, object) -> {
            if (key.contextKind == contextKind)
                allIdsOfKind.add(key.getKey());
        });
        return allIdsOfKind;
    }

    public <T extends Object> void putList (ContextKind contextKind, List<T> values, Function<T, String> fn){
        List<String> oldIds = getAllIdsOfKind(contextKind);
        List<String> newIds = new ArrayList<>();

        values.forEach(
                value -> {
                    this.put(fn.apply(value), contextKind, value );
                    newIds.add(fn.apply(value));
                }
        );
        oldIds.forEach(
                id -> {
                    if (! newIds.contains(id)) {
                        this.remove(id, contextKind);
                    }
                }
        );
    }

    @Data
    @AllArgsConstructor
    private class Key{
        ContextKind contextKind;
        String key;

    }

}
