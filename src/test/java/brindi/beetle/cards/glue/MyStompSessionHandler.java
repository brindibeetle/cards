package brindi.beetle.cards.glue;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

import java.util.UUID;

public class MyStompSessionHandler extends StompSessionHandlerAdapter {

    private Logger logger = LogManager.getLogger(MyStompSessionHandler.class);
    private UUID playerUuid = UUID.randomUUID();

    @Override
    public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
        logger.info("New session established : " + session.getSessionId());
        session.subscribe("/signedupPersonal/" + playerUuid, this);
        logger.info("Subscribed to /signedupPersonal/" + playerUuid);
        session.subscribe("/signedupAll/", this);
        logger.info("Subscribed to /signedupAll");
//        session.send("/signedupAll/", getSampleMessage());
//        logger.info("Message sent to websocket server");
    }

    @Override
    public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
        logger.error("Got an exception", exception);
    }

//    @Override
//    public Type getPayloadType(StompHeaders headers) {
//        return Message.class;
//    }

//    @Override
//    public void handleFrame(StompHeaders headers, Object payload) {
//        Message msg = (Message) payload;
//        logger.info("Received : " + msg.getText() + " from : " + msg.getFrom());
//    }

    /**
     * A sample message instance.
     * @return instance of <code>Message</code>
     */
//    private Message getSampleMessage() {
//        Message msg = new Message();
//        msg.setFrom("Nicky");
//        msg.setText("Howdy!!");
//        return msg;
//    }
}