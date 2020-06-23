Feature: One player plays a game

  Scenario: player gets dealt cards
    Given player Emile opens a new session
    And the player creates new game Jokeren
    And the player starts the game
    And the dealer gives the following cards:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |
      | DIAMONDS | N5 | DARK | |
      | DIAMONDS | N6 | DARK | |
      | DIAMONDS | N7 | DARK | |
      | DIAMONDS | N8 | DARK | |

    Then the player holds the following cards:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |
      | DIAMONDS | N5 | DARK | |
      | DIAMONDS | N6 | DARK | |
      | DIAMONDS | N7 | DARK | |
      | DIAMONDS | N8 | DARK | |


  Scenario: player takes card from stock
    Given player Emile opens a new session
    And the player creates new game Jokeren
    And the player starts the game
    And the dealer gives the following cards:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |
      | DIAMONDS | N5 | DARK | |
      | DIAMONDS | N6 | DARK | |
      | DIAMONDS | N7 | DARK | |
      | DIAMONDS | N8 | DARK | |
    And the player takes card N2 of HEARTS with DARK back from stock

    Then the player holds the following cards:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |
      | DIAMONDS | N5 | DARK | |
      | DIAMONDS | N6 | DARK | |
      | DIAMONDS | N7 | DARK | |
      | DIAMONDS | N8 | DARK | |
      | HEARTS | N2 | DARK | |


  Scenario: player puts meld on table
    Given player Emile opens a new session
    And the player creates new game Jokeren
    And the player starts the game
    And the dealer gives the following cards:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |
      | DIAMONDS | N5 | DARK | |
      | DIAMONDS | N6 | DARK | |
      | DIAMONDS | N7 | DARK | |
      | DIAMONDS | N8 | DARK | |
    And the player takes card N2 of HEARTS with DARK back from stock
    And the player lays the following cards on the table:
      | DIAMONDS | N2 | DARK | |
      | DIAMONDS | N3 | DARK | |
      | DIAMONDS | N4 | DARK | |
      | DIAMONDS | N5 | DARK | |
      | DIAMONDS | N6 | DARK | |
      | DIAMONDS | N7 | DARK | |
      | DIAMONDS | N8 | DARK | |
    Then the player holds the following cards:
      | HEARTS | N2 | DARK | |
