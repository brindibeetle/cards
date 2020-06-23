package beetle.brindi.cards;

import io.cucumber.junit.Cucumber;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.MessageHeaders;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RunWith(Cucumber.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//@Ignore
public class SpringCucumberIntegrationTests {

    private final String SERVER_URL = "http://localhost";
    private final String THINGS_ENDPOINT = "/things";

    private RestTemplate restTemplate;

    protected MessageHeaders messageHeaders(String sessionId) {
        Map<String, Object> headers = new HashMap<String, Object>();
        headers.put("simpSessionId", sessionId);
        return new MessageHeaders(headers);
    }

    public SpringCucumberIntegrationTests() {
    }


}
