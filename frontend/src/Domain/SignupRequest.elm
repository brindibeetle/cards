module Domain.SignupRequest exposing (..)


import Json.Encode as Encode
import Session exposing (Session)


type alias SignupRequest =
    {
        typeRequest : TypeRequest
        , gameName : String
        , playerName : String
        , gameUuid : String
        --, playerUuid : String  generated in js in index.html
    }


type TypeRequest =
    CreateRequest
    | JoinRequest
    | GamesAndPlayersRequest
    | StartRequest


-- ####
-- ####   ENCODER
-- ####


signupRequestEncoder : SignupRequest -> Encode.Value
signupRequestEncoder { typeRequest, gameName, playerName, gameUuid } =
    Encode.object
        [ ( "typeRequest", typeRequestEncoder typeRequest )
        , ( "gameName", Encode.string gameName )
        , ( "playerName", Encode.string playerName )
        , ( "gameUuid", Encode.string gameUuid )
        ]


typeRequestEncoder : TypeRequest -> Encode.Value
typeRequestEncoder typeRequest =
    case typeRequest of
        CreateRequest -> Encode.string "CREATE"
        JoinRequest -> Encode.string "JOIN"
        GamesAndPlayersRequest -> Encode.string "GAMES_AND_PLAYERS"
        StartRequest -> Encode.string "START"


-- ####
-- ####   HELPER
-- ####


makeCreateRequest : String -> String -> SignupRequest
makeCreateRequest gameName playerName =
    {
            typeRequest = CreateRequest
            , gameUuid = ""
            , gameName = gameName
            , playerName = playerName
        }


makeJoinRequest : String -> String -> SignupRequest
makeJoinRequest gameUuid playerName  =
    {
            typeRequest = JoinRequest
            , gameUuid = gameUuid
            --, playerUuid = session.playerUuid
            , gameName = ""
            , playerName = playerName
        }


makeGamesRequest : SignupRequest
makeGamesRequest =
    {
            typeRequest = GamesAndPlayersRequest
            , gameUuid = ""
            , gameName = ""
            , playerName = ""
        }


makeStartRequest : Session -> SignupRequest
makeStartRequest session =
    {
        typeRequest = StartRequest
        , gameUuid = session.gameUuid
        , gameName = ""
        , playerName = session.playerName
    }