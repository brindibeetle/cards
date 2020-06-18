package brindi.beetle.cards.testrunners;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
        plugin="pretty"
        , features = "src/test/resources/cucumber/features/"
        , glue   = {"brindi.beetle.cards.glue"}
)
public class CardsTest {

    @BeforeClass
    public static void setupTestData() throws Exception {

    }

    @AfterClass
    public static void tearDown() {

    }
}
