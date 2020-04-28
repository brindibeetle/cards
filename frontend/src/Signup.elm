module Signup exposing (..)

import Bootstrap.Table as Table
import Bootstrap.Form as Form
import Bootstrap.Form.Input as Input
import Bootstrap.Button as Button

import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline as Pipeline exposing (..)
import RemoteData exposing (WebData)
import Session exposing (..)


-- ####
-- ####   MODEL
-- ####


type alias Model =
    { playerName : String
    , playerUuid : String
    , gameUuid : String
    , dtoGame : WebData DTOgame
    }


init : Session -> ( Model, Cmd Msg )
init session =
    (
        { playerName = ""
        , playerUuid = ""
        , gameUuid = ""
        , dtoGame = RemoteData.NotAsked
        }
        , Cmd.none
    )


-- ####
-- ####   VIEW
-- #### 


view : Model -> Html Msg
view model =
    let
        { statusText, playerNameDisabled, doCreateDisabled, doStartDisabled, playerUuid, gameUuid } =
                case model.dtoGame of
                    RemoteData.NotAsked ->
                        { statusText = "Initialising.", playerNameDisabled = False, doCreateDisabled = False, doStartDisabled = True, playerUuid = "", gameUuid = "" }
                    RemoteData.Loading ->
                        { statusText = "Loading.", playerNameDisabled = True, doCreateDisabled = True, doStartDisabled = True, playerUuid = "", gameUuid = "" }
                    RemoteData.Failure error ->
                        { statusText = "Error: " ++ ( buildErrorMessage error), playerNameDisabled = True, doCreateDisabled = True, doStartDisabled = True, playerUuid = "", gameUuid = "" }
                    RemoteData.Success dtoGame ->
                        { statusText = "Success.", playerNameDisabled = True, doCreateDisabled = True, doStartDisabled = False, playerUuid = dtoGame.playerUuid, gameUuid = dtoGame.gameUuid }
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
                , Input.text [ Input.onInput UpdatePlayername, Input.value model.playerName, Input.disabled playerNameDisabled ]
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
                                        [ Button.outlinePrimary, Button.attrs [ disabled doCreateDisabled ], Button.onClick ( DoCreateGame model.playerName ) ]
                                        [ text "New game" ]
                                    ]
                                , Table.td [  ]
                                    [ Button.button
                                        [ Button.outlinePrimary, Button.attrs [ disabled doStartDisabled ], Button.onClick DoStartGame  ]
                                        [ text "Start game" ]
                                    ]
                                ]
                            ]
                        )
                    ]
                ]
        ]


-- ####
-- ####   UPDATE
-- #### 


type Msg =
    UpdatePlayername String
    | DoCancel
    | DoCreateGame String
    | DoStartGame
    | GameCreated (WebData DTOgame)


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg } 
update msg model session =
    case msg of
        UpdatePlayername newName ->
            { model =
                { model
                | playerName = newName
                }
            , session = session
            , cmd = Cmd.none
            }

        DoCancel ->
            { model = model, session = session, cmd = Cmd.none }

        DoCreateGame playerName ->
            { model = { model | dtoGame = RemoteData.Loading }
            , session = session
            , cmd = doCreateGame GameCreated playerName session }

        DoStartGame ->
            { model = model, session = session, cmd = Cmd.none }

        GameCreated response ->
            { model =
                { model
                | dtoGame = response
                }
            , session = session
            , cmd = Cmd.none
            }


-- ####
-- ####   SUBSCRIPTION
-- #### 


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- ###
-- ###    ENDPOINTS
-- ###

cardsApiUrl : Session -> String
cardsApiUrl _ =
    "http://localhost:8080/v1/cards"

type alias DTOgame =
    {
        gameUuid : String
        , playerUuid : String
    }

doCreateGame : (WebData DTOgame -> Msg) -> String -> Session -> Cmd Msg
doCreateGame msg playerName session =
    let
        requestUrl = cardsApiUrl session ++ "/jokeren/new?playerName=" ++ playerName
    in
        Http.get
            { url = requestUrl
            , expect = Http.expectJson (RemoteData.fromResult >> msg) dtoGameDecoder
            }

dtoGameDecoder : Decoder DTOgame
dtoGameDecoder =
    Decode.succeed DTOgame
        |> Pipeline.required "gameUuid" string
        |> Pipeline.required "playerUuid" string



-- ###
-- ###    UTILS
-- ###

buildErrorMessage : Http.Error -> String
buildErrorMessage httpError =
    case httpError of
        Http.BadUrl message ->
            message

        Http.Timeout ->
            "Server is taking too long to respond. Please try again later."

        Http.NetworkError ->
            "Unable to reach server."

        Http.BadStatus statusCode ->
            "Request failed with status code: " ++ String.fromInt statusCode

        Http.BadBody message ->
            message