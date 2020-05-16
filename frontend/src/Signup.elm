port module Signup exposing (..)

import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Button as Button

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Encode as Encode exposing (..)

import Session exposing (..)
import Domain.DTOgame exposing (DTOgame, decodeDTOGame)


-- ####
-- ####   MODEL
-- ####


type alias Model =
    {  phase : Phase
    }


type Phase = PhaseInit | PhaseCreateAsked | PhaseCreated | PhaseStart


init : Session -> ( Model, Cmd Msg )
init session =
    (
        { phase = PhaseInit
        }
        , Cmd.none
    )


-- ####
-- ####   VIEW
-- #### 


view : Model -> Session -> Html Msg
view model session =
    let
        statusText = "test"
        { phase } = model
        { playerName, playerUuid, gameUuid } = session
    in
    div [ class "container" ]
        [
            div []
            [
                text statusText
            ]
            , Form.form []
            [ Form.group []
                [ Form.label [] [ text "Your name or alias"]
                , Input.text [ Input.onInput UpdatePlayername, Input.value playerName, Input.disabled ( phase /= PhaseInit ) ]
                ]
            , Form.group [ ]
                [ Form.label [] [ text "Player identifier"]
                , Input.text [ Input.value playerUuid, Input.disabled True ]
                ]
            , Form.group []
                [ Form.label [] [ text "Game identifier"]
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
                                        [ text "Cancel" ]
                                    ]
                                , Table.td [ ]
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ disabled ( phase /= PhaseInit || playerName == "") ]
                                            , Button.onClick ( DoCreateGame playerName ) ]
                                        [ text "New game" ]
                                    ]
                                , Table.td [  ]
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ disabled ( phase /= PhaseCreated ) ]
                                            , Button.onClick DoStartGame  ]
                                        [ text "Start game" ]
                                    ]
                                ]
                            ]
                        )
                    ]
                ]
        ]


-- ####
-- ####   PORTS
-- ####


port signupSend : String -> Cmd msg
port signupReceiver : (Encode.Value -> msg) -> Sub msg


-- ####
-- ####   UPDATE
-- ####


type Msg =
    UpdatePlayername String
    | DoCancel
    | DoCreateGame String
    | DoStartGame
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

        DoCancel ->
            { model = model, session = session, cmd = Cmd.none }

        DoCreateGame playerName ->
            { model =
                { model | phase = PhaseCreateAsked }
            , session = session
            , cmd = signupSend playerName  }

        DoStartGame ->
            { model =
                { model | phase = PhaseStart }
            , session = session
            , cmd = Cmd.none
            }

        Recv message ->
            let
                dtoGame = decodeDTOGame message
            in
            {
                model =
                    { model
                    | phase = PhaseCreated
                    }
                , session =
                    { session
                    | playerUuid = dtoGame.playerUuid
                    , gameUuid = dtoGame.gameUuid
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
