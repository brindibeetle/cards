package brindi.beetle.cards.config;

import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

//@PropertySource("application.properties")
//@ComponentScan("brindi.beetle.cards")
//@ContextConfiguration(classes = {SigningUpController.class, SigningUpService.class, PlayService.class, SimpMessagingTemplate.class})
@RunWith(SpringRunner.class)
@ContextConfiguration
@SpringBootTest
public class Config {
}