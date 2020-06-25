Feature: Three players play a game

  Scenario: Three players play a game
    Given player Emile opens a new session
    And the player creates new game Jokeren
    And player Parsa opens a new session
    And the player joins the game Jokeren
    And player Denna opens a new session
    And the player joins the game Jokeren
    And session is of player Emile
    And the player starts the game
    And the dealer gives the following cards:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |

    And session is of player Parsa
    And the dealer gives the following cards:
      | HEARTS | N2 | DARK | |
      | HEARTS | N3 | DARK | |
      | HEARTS | N4 | DARK | |

    And session is of player Denna
    And the dealer gives the following cards:
      | CLUBS | N2 | DARK | |
      | CLUBS | N3 | DARK | |
      | CLUBS | N4 | DARK | |

    And session is of player Emile
    And the player takes card JACK of SPADES with DARK back from stock
    And the player lays the following cards on the table:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |
    And the player puts the card JACK of SPADES with DARK back on bottom of stock

    And session is of player Parsa
    And the player takes card JACK of CLUBS with DARK back from stock
    And the player lays the following cards on the table:
      | HEARTS | N2 | DARK | |
      | HEARTS | N3 | DARK | |
      | HEARTS | N4 | DARK | |
    And the player puts the card JACK of CLUBS with DARK back on bottom of stock

    And session is of player Denna
    And the player takes card JACK of HEARTS with DARK back from stock
    And the player lays the following cards on the table:
      | CLUBS | N2 | DARK | |
      | CLUBS | N3 | DARK | |
      | CLUBS | N4 | DARK | |
    And the player puts the card JACK of HEARTS with DARK back on bottom of stock

    Then the player Emile should have 0 cards in his hands
    Then the player Emile should be finished
    Then the player Parsa should have 0 cards in his hands
    Then the player Parsa should be finished
    Then the player Denna should have 0 cards in her hands
    Then the player Denna should be finished

