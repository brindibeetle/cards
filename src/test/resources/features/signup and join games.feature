Feature: Signing up and joining a game

  Scenario: player connects and creates a game
    Given player Emile opens a new session
    And the player creates new game Jokeren
    Then there should be a game with name Jokeren

