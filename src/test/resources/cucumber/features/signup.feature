Feature: Signing up

  Scenario: player attempts to create a game
    Given player connects the game
    When player with name Pipo creates game with name Circus
    Then the client receives answer as 3
