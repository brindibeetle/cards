Feature: Signing up and creating a game

  Scenario: player connects and creates a game
    Given player Emile opens a new session
    And the player creates new game Jokeren
    Then there should be a game with name Jokeren

  Scenario: 2 players connect and create games
    Given player Shahed opens a new session
    And the player creates new game Jokeren1
    And player Parsa opens a new session
    And the player creates new game Jokeren2
    Then the available games should be Jokeren1,Jokeren2

  Scenario: 4 players connect and create games
    Given player Shahed opens a new session
    And the player creates new game Jokeren1
    And player Parsa opens a new session
    And the player creates new game Jokeren2
    And player Denna opens a new session
    And the player creates new game Jokeren3
    And player Emile opens a new session
    And the player creates new game Jokeren4
    Then the available games should be Jokeren1,Jokeren2,Jokeren3,Jokeren4

  Scenario: player connects and create game and other player sees the game
    Given player Emile opens a new session
    And the player creates new game Jokeren
    And player Parsa opens a new session
    Then there should be a game with name Jokeren

  Scenario: player connects and create game and other players join
    Given player Shahed opens a new session
    And the player creates new game Jokeren
    And player Denna opens a new session
    And the player joins the game Jokeren
    Then the game Jokeren should exist with players Shahed,Denna