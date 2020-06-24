port module Signup exposing (..)

import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input exposing (..)
import Bootstrap.Button as Button
import Bootstrap.Card as Card
import Bootstrap.Card.Block as Block

import Domain.DTOplayer exposing (DTOplayer, PlayerStatus(..))
import Domain.SignupRequest exposing (..)
import Domain.SignupAllResponse exposing (TypeResponse(..), signupAllResponseDecodeValue)
import Domain.SignupPersonalResponse exposing (TypeResponse(..), signupPersonalResponseDecodeValue)
import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Encode as Encode exposing (..)

import Session exposing (..)
import Domain.DTOgame exposing (DTOgame, decodeDTOGame, emptyDTOgame)


-- ####
-- ####   MODEL
-- ####


type alias Model =
    { phase : Phase
    , pending : Bool
    , games : List DTOgame
    , joinGame : String
    }


type Phase = PhaseInit | PhaseCreated String | PhaseJoined String | PhaseStart


init : Session -> ( Model, Cmd Msg )
init session =
    (
        { phase = PhaseInit
        , pending = False
        , games = []
        , joinGame = ""
        }
        --, Cmd.none
        , makeGamesRequest |> signupRequestEncoder |> signupSend
    )


-- ####
-- ####   VIEW
-- #### 


view : Model -> Session -> Html Msg
view model session =
    let
        statusText = "test"
        { phase, pending, joinGame } = model
        { playerUuid, gameUuid, playerName } = session
    in
    div [ class "container" ]
        [
            div []
            [
                Form.form []
                [ Form.group []
                    [ Form.label [ class "signup-label" ] [ Html.text "Your name or alias"]
                    , Input.text [ Input.attrs [ class "signup-playername" ], Input.small, Input.onInput UpdatePlayerName, Input.value playerName, Input.disabled ( pending || phase /= PhaseInit ) ]
                    ]
                ]
            ]
            , div [ class "signup-card-deck" ]
                ( case newGame model session of
                    Just newGameHtml ->
                        ( newGameHtml :: List.map (viewGame model session) model.games )

                    Nothing ->
                        List.map (viewGame model session) model.games
                )

        ]

viewGame : Model -> Session -> DTOgame -> Html Msg
viewGame { phase, pending } { playerName } game =
    let
        { started, gameName, gameUuid, players, creator } = game
        topText = if started then "was started by " ++ creator else "wanna join? created by " ++ creator
    in
    ( case phase of
        PhaseInit ->
            viewGameCard
                { topText = topText
                , buttonText = "Join game"
                , buttonMsg = DoJoinGame gameUuid
                , buttonDisabled = ( pending || started || playerName == "" )
                , nameDisabled = True
                }
                { gameName = gameName
                , players = players
                }

        PhaseCreated uuid ->
            if uuid == gameUuid then
                viewGameCard
                    { topText = "Waiting for joiners..."
                    , buttonText = "Start game"
                    , buttonMsg = DoStartGame
                    , buttonDisabled = pending
                    , nameDisabled = True
                    }
                    { gameName = gameName
                    , players = players
                    }
            else
                viewGameCard
                    { topText = topText
                    , buttonText = "Join game"
                    , buttonMsg = DoJoinGame gameUuid
                    , buttonDisabled = True
                    , nameDisabled = True
                    }
                    { gameName = gameName
                    , players = players
                    }

        PhaseJoined uuid ->
            if uuid == gameUuid then
                viewGameCard
                    { topText = "Waiting for " ++ creator
                    , buttonText = "Waiting"
                    , buttonMsg = DoJoinGame gameUuid
                    , buttonDisabled = True
                    , nameDisabled = True
                    }
                    { gameName = gameName
                    , players = players
                    }
            else
                viewGameCard
                    { topText = topText
                    , buttonText = "Join game"
                    , buttonMsg = DoJoinGame gameUuid
                    , buttonDisabled = True
                    , nameDisabled = True
                    }
                    { gameName = gameName
                    , players = players
                    }


        PhaseStart ->
            Html.text "Something is wrong here"
    )


newGame : Model -> Session -> Maybe ( Html Msg )
newGame { phase, pending } { playerName, gameName } =
    case phase of
        PhaseInit ->
            viewGameCard
                { topText = "Start your own game?"
                , buttonText = "Create new game"
                , buttonMsg = DoCreateGame gameName playerName
                , buttonDisabled = ( pending || gameName == "" || playerName == "")
                , nameDisabled = ( pending || phase /= PhaseInit )
                }
                { gameName = gameName
                , players = []
                }
            |> Maybe.Just

        _ ->
            Nothing


viewGameCard : { topText : String, buttonText : String, buttonMsg : Msg, buttonDisabled : Bool, nameDisabled : Bool}
    -> { gameName : String, players : List DTOplayer }
    -> Html Msg
viewGameCard { topText, buttonText, buttonMsg, buttonDisabled, nameDisabled } { gameName, players } =
    Card.config [ Card.attrs [ class "signup-game-card" ] ]
    |> Card.header [ class "signup-game-card-header" ]
        [ Html.text topText
        ]

    |> Card.block [ Block.attrs [ class "signup-game-card-body" ] ]
        --[ Block.titleH4 [] [ Html.text "Players" ]
        [ Block.titleH6 [] [ Input.text
            [ Input.attrs [ class "signup-game-card-title" ]
            , Input.value gameName
            , Input.onInput UpdateGameName
            , Input.disabled nameDisabled
            ]
        ]
        , Block.text [ class "signup-game-card-players" ]
            ( List.map viewPlayer players )
        ]

    |> Card.block [ Block.attrs [ class "signup-game-card-bottom" ] ]
        [ Block.custom <|
            Button.button
                [ Button.primary
                , Button.onClick buttonMsg
                , Button.attrs [ Html.Attributes.disabled buttonDisabled, class "signup-game-card" ]
                ]
                [ Html.text buttonText ]
        ]

    |> Card.view


viewPlayer : DTOplayer -> Html Msg
viewPlayer { playerName, playerStatus } =
    case playerStatus of
        PLAYING ->
            div [ class "signup-player" ] [ Html.text playerName ]
        DISCONNECTED ->
            div [ class "signup-player-disconnected" ] [ Html.text playerName ]
        _ ->
            div [ ] [ Html.text playerName ]


-- ####
-- ####   PORTS
-- ####


port signupSend : Encode.Value -> Cmd msg
port signupPersonalReceiver : (Encode.Value -> msg) -> Sub msg
port signupAllReceiver : (Encode.Value -> msg) -> Sub msg


-- ####
-- ####   UPDATE
-- ####


type Msg =
    UpdatePlayerName String
    | UpdateGameName String
    | UpdateJoinGame String
    | DoCancel
    | DoCreateGame String String
    | DoStartGame
    | DoJoinGame String
    | SignUpPersonal Encode.Value
    | SignUpAll Encode.Value


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of
        UpdateGameName newName ->
            { model = model
            , session =
                { session
                | gameName = newName
                }
            , cmd = Cmd.none
            }

        UpdatePlayerName newName ->
            { model = model
            , session =
                { session
                | playerName = newName
                }
            , cmd = Cmd.none
            }

        UpdateJoinGame gameUuid ->
            { model =
                { model
                | joinGame = gameUuid
                }
            , session =
                { session
                | gameUuid = gameUuid
                }
            , cmd = Cmd.none
            }

        DoCancel ->
            { model = model, session = session, cmd = Cmd.none }

        DoCreateGame gameName playerName ->
            { model =
                { model
                | pending = True
                }
            , session = session
            , cmd = makeCreateRequest gameName playerName |> signupRequestEncoder |> signupSend  }

        DoJoinGame gameUuid ->
            { model =
                { model
                | pending = True
                , phase = PhaseJoined gameUuid
                }
            , session = session
            , cmd = makeJoinRequest gameUuid session.playerName |> signupRequestEncoder |> signupSend  }

        DoStartGame ->
            { model =
                { model
                | pending = True
                , phase = PhaseStart
                }
            , session = session
            , cmd = makeStartRequest session |> signupRequestEncoder |> signupSend
            }

        SignUpPersonal encoded ->
            let
                { playerUuid, gameUuid, typeResponse, games } = Debug.log "signupResponseDecodeValue" (signupPersonalResponseDecodeValue encoded)
            in
                case typeResponse of
                    Domain.SignupPersonalResponse.CreateResponse ->
                        {
                            model =
                                { model
                                | pending = False
                                , phase = PhaseCreated gameUuid
                                }
                            , session =
                                { session
                                | playerUuid = playerUuid
                                , gameUuid = gameUuid
                                }
                            , cmd = Cmd.none
                        }

                    Domain.SignupPersonalResponse.JoinResponse ->
                        {
                            model =
                                { model
                                | pending = False
                                }
                            , session =
                                { session
                                | playerUuid = playerUuid
                                , gameUuid = gameUuid
                                }
                            , cmd = Cmd.none
                        }

                    Domain.SignupPersonalResponse.GamesAndPlayersResponse ->
                        {
                            model =
                                { model
                                | pending = False
                                , games = games
                                }
                            , session =
                                { session
                                | playerUuid = playerUuid
                                , gameUuid = gameUuid
                                }
                            , cmd = Cmd.none
                        }


        SignUpAll encoded ->
            let
                { gameUuid, typeResponse, games } = Debug.log "signupResponseDecodeValue" (signupAllResponseDecodeValue encoded)
            in
                case ( model.phase, typeResponse ) of
                    ( PhaseJoined gameUuid1, Domain.SignupAllResponse.GamesAndPlayersResponse ) ->
                        {
                            model =
                                { model
                                | games = games
                                , phase =
                                    -- if the joined game has stopped existing then back to init
                                    if ( games |> List.any ( \game -> if game.gameUuid == gameUuid1 then True else False ) )
                                    then
                                        model.phase
                                    else
                                        PhaseInit
                                }
                            , session =session
                            , cmd = Cmd.none
                        }

                    ( _, Domain.SignupAllResponse.GamesAndPlayersResponse ) ->
                        {
                            model =
                                { model
                                | games = games
                                }
                            , session =session
                            , cmd = Cmd.none
                        }
                    ( _, _ ) ->
                        { model = model
                        , session = session
                        , cmd = Cmd.none
                        }

-- ####
-- ####   SUBSCRIPTION
-- #### 


subscriptions : Sub Msg
subscriptions =
    Sub.batch
        [ signupPersonalReceiver SignUpPersonal
        , signupAllReceiver SignUpAll
        ]

-- ####
-- ####   HELPER
-- ####
