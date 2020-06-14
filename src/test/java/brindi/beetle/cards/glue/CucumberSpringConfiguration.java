package brindi.beetle.cards.glue;


import brindi.beetle.cards.config.Config;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.test.context.ContextConfiguration;

@ContextConfiguration(classes = Config.class)
@CucumberContextConfiguration
public class CucumberSpringConfiguration {
}
