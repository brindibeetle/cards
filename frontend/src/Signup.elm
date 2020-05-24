port module Signup exposing (..)

import Bootstrap.Form.Select as Select
import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input exposing (..)
import Bootstrap.Button as Button

import Domain.SignupRequest exposing (..)
import Domain.SignupResponse exposing (TypeResponse(..), signupResponseDecodeValue)
import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Encode as Encode exposing (..)

import Session exposing (..)
import Domain.DTOgame exposing (DTOgame, decodeDTOGame)


-- ####
-- ####   MODEL
-- ####


type alias Model =
    { phase : Phase
    , games : List String
    , joinGame : String
    }


type Phase = PhaseInit | PhaseCreateAsked | PhaseCreated | PhaseStart


init : Session -> ( Model, Cmd Msg )
init session =
    (
        { phase = PhaseInit
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
        { phase, joinGame } = model
        { playerName, playerUuid, gameUuid } = session
    in
    div [ class "container" ]
        [
            div []
            [
                Html.text statusText
            ]
            , Form.form []
            [ Form.group []
                [ Form.label [ class "signup-label" ] [ Html.text "Your name or alias"]
                , Input.text [ Input.onInput UpdatePlayername, Input.value playerName, Input.disabled ( phase /= PhaseInit ) ]
                ]
            , Form.group [ ]
                [ Form.label [ class "signup-label" ] [ Html.text "Games that are playing"]
                , Select.select
                    [ Select.onChange UpdateJoinGame ]
                    ( List.map viewGame model.games )
                ]
            , Form.group [ ]
                [ Form.label [ class "signup-label" ] [ Html.text "Player identifier"]
                , Input.text [ Input.value playerUuid, Input.disabled True ]
                ]
            , Form.group []
                [ Form.label [ class "signup-label" ] [ Html.text "Game identifier"]
                , Input.text [ Input.value gameUuid, Input.disabled True ]
                ]
            , Form.group []
                    [ Table.simpleTable
                        ( Table.thead [] []
                        , Table.tbody []
                            [ Table.tr []
                                [ Table.td []
                                    [ Button.button
                                        [ Button.outlineSecondary, Button.attrs [ ], Button.onClick DoCancel ]
                                        [ Html.text "Cancel" ]
                                    ]
                                , Table.td [ ]
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ Html.Attributes.disabled ( phase /= PhaseInit || playerName == "") ]
                                            , Button.onClick ( DoCreateGame playerName ) ]
                                        [ Html.text "New game" ]
                                    ]
                                , Table.td [ ]
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ Html.Attributes.disabled ( phase /= PhaseInit || playerName == "" || joinGame == "") ]
                                            , Button.onClick ( DoJoinGame joinGame playerName ) ]
                                        [ Html.text "Join game" ]
                                    ]
                                , Table.td [  ]
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ Html.Attributes.disabled ( phase /= PhaseCreated ) ]
                                            , Button.onClick DoStartGame  ]
                                        [ Html.text "Start game" ]
                                    ]
                                ]
                            ]
                        )
                    ]
                ]
        ]


viewGame : String -> Select.Item Msg
viewGame game =
    Select.item [ Html.Attributes.value game ] [ Html.text game ]

-- ####
-- ####   PORTS
-- ####


port signupSend : Encode.Value -> Cmd msg
port signupReceiver : (Encode.Value -> msg) -> Sub msg


-- ####
-- ####   UPDATE
-- ####


type Msg =
    UpdatePlayername String
    | UpdateJoinGame String
    | DoCancel
    | DoCreateGame String
    | DoStartGame
    | DoJoinGame String String
    | Recv Encode.Value


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of
        UpdatePlayername newName ->
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
            , session = session
            , cmd = Cmd.none
            }

        DoCancel ->
            { model = model, session = session, cmd = Cmd.none }

        DoCreateGame playerName ->
            { model =
                { model | phase = PhaseCreateAsked }
            , session = session
            , cmd = makeCreateRequest playerName |> signupRequestEncoder |> signupSend  }

        DoJoinGame gameUuid playerName ->
            { model =
                { model | phase = PhaseCreateAsked }
            , session = session
            , cmd = makeJoinRequest gameUuid playerName |> signupRequestEncoder |> signupSend  }

        DoStartGame ->
            { model =
                { model | phase = PhaseStart }
            , session = session
            , cmd = Cmd.none
            }

        Recv encoded ->
            let
                { playerUuid, gameUuid, typeResponse, games } = signupResponseDecodeValue encoded
            in
                case typeResponse of
                    CreateResponse ->
                        {
                            model =
                                { model
                                | phase = PhaseCreated
                                }
                            , session =
                                { session
                                | playerUuid = playerUuid
                                , gameUuid = gameUuid
                                }
                            , cmd = Cmd.none
                        }

                    JoinResponse ->
                        {
                            model =
                                { model
                                | phase = PhaseCreated
                                }
                            , session =
                                { session
                                | playerUuid = playerUuid
                                , gameUuid = gameUuid
                                }
                            , cmd = Cmd.none
                        }


                    GamesResponse ->
                        {
                            model =
                                { model
                                | phase = PhaseInit
                                , games = "" :: games
                                }
                            , session =
                                { session
                                | playerUuid = playerUuid
                                , gameUuid = gameUuid
                                }
                            , cmd = Cmd.none
                        }


                    StartResponse ->
                        {
                            model =
                                { model
                                | phase = PhaseStart
                                }
                            , session =
                                { session
                                | playerUuid = playerUuid
                                , gameUuid = gameUuid
                                }
                            , cmd = Cmd.none
                        }



-- ####
-- ####   SUBSCRIPTION
-- #### 


subscriptions : Model -> Sub Msg
subscriptions _ =
    signupReceiver Recv


-- ####
-- ####   HELPER
-- ####
