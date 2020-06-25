Feature: Three players start a game and get dealt

  Scenario: Three players start a game and get dealt
    Given player Emile opens a new session
    And the player creates new game Jokeren
    And player Parsa opens a new session
    And the player joins the game Jokeren
    And player Denna opens a new session
    And the player joins the game Jokeren
    And player Shahed opens a new session
    And the player joins the game Jokeren
    And session is of player Emile
    And the player starts the game
    And the player requests to get dealt
    And session is of player Parsa
    And the player requests to get dealt
    And session is of player Denna
    And the player requests to get dealt
    And session is of player Shahed
    And the player requests to get dealt

    Then the player Emile should have 13 cards in his hands
    Then the player Parsa should have 13 cards in his hands
    Then the player Denna should have 13 cards in her hands
    Then the player Shahed should have 13 cards in her hands
    Then the deck should hold 26 cards of suit CLUBS
    Then the deck should hold 26 cards of suit DIAMONDS
    Then the deck should hold 26 cards of suit HEARTS
    Then the deck should hold 26 cards of suit SPADES
    Then the deck should hold 20 cards of specialType JOKER
    Then the deck should hold 124 cards
