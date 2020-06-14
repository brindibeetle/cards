package brindi.beetle.cards.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

@PropertySource("application.properties")
@ComponentScan("brindi.beetle.cards")
public class Config {
}