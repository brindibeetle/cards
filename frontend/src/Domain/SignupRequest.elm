module Domain.SignupRequest exposing (..)


import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Json.Encode as Encode
import Session exposing (Session)


type alias SignupRequest =
    {
        typeRequest : TypeRequest
        , playerName : String
        , gameUuid : String
        --, playerUuid : String  generated in js in index.html
    }


type TypeRequest =
    CreateRequest
    | JoinRequest
    | GamesRequest
    | StartRequest


-- ####
-- ####   ENCODER
-- ####


signupRequestEncoder : SignupRequest -> Encode.Value
signupRequestEncoder { typeRequest, playerName, gameUuid } =
    Encode.object
        [ ( "typeRequest", typeRequestEncoder typeRequest )
        , ( "playerName", Encode.string playerName )
        , ( "gameUuid", Encode.string gameUuid )
        ]


typeRequestEncoder : TypeRequest -> Encode.Value
typeRequestEncoder typeRequest =
    case typeRequest of
        CreateRequest -> Encode.string "CREATE"
        JoinRequest -> Encode.string "JOIN"
        GamesRequest -> Encode.string "GAMES"
        StartRequest -> Encode.string "START"


-- ####
-- ####   HELPER
-- ####


makeCreateRequest : String -> SignupRequest
makeCreateRequest playerName =
    {
            typeRequest = CreateRequest
            , gameUuid = ""
            , playerName = playerName
        }


makeJoinRequest : String -> String -> SignupRequest
makeJoinRequest gameUuid playerName  =
    {
            typeRequest = JoinRequest
            , gameUuid = gameUuid
            --, playerUuid = session.playerUuid
            , playerName = playerName
        }


makeGamesRequest : SignupRequest
makeGamesRequest =
    {
            typeRequest = GamesRequest
            , gameUuid = ""
            , playerName = ""
        }


makeStartRequest : Session -> SignupRequest
makeStartRequest session =
    {
        typeRequest = StartRequest
        , gameUuid = session.gameUuid
        , playerName = session.playerName
    }