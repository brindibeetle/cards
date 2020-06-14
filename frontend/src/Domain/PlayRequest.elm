module Domain.PlayRequest exposing (..)

import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder)
import Json.Encode as Encode
import Session exposing (Session)


type alias PlayRequest =
    {
        typeRequest : TypeRequest
        , gameUuid : String
        , playerUuid : String
        , cards : List DTOcard
        , handPosition : Int
        , tablePosition : Int
    }


type TypeRequest =
    GetFromStackBottomRequest
    | GetFromStackTopRequest
    | PutOnStackBottomRequest
    | PutOnTableRequest
    | SlideOnTableRequest
    | DealRequest


-- ####
-- ####   ENCODER
-- ####


playRequestEncoder : PlayRequest -> Encode.Value
playRequestEncoder { typeRequest, gameUuid, playerUuid, cards, handPosition, tablePosition } =
    Encode.object
        [ ( "typeRequest", typeRequestEncoder typeRequest )
        , ( "gameUuid", Encode.string gameUuid )
        , ( "playerUuid", Encode.string playerUuid )
        , ( "cards", Encode.list dtoCardEncoder cards )
        , ( "handPosition", Encode.int handPosition )
        , ( "tablePosition", Encode.int tablePosition )
        ]


typeRequestEncoder : TypeRequest -> Encode.Value
typeRequestEncoder typeRequest =
    case typeRequest of
        GetFromStackBottomRequest -> Encode.string "GET_FROM_STACK_BOTTOM"
        GetFromStackTopRequest -> Encode.string "GET_FROM_STACK_TOP"
        PutOnStackBottomRequest -> Encode.string "PUT_ON_STACK_BOTTOM"
        DealRequest -> Encode.string "DEAL"
        PutOnTableRequest -> Encode.string "PUT_ON_TABLE"
        SlideOnTableRequest -> Encode.string "SLIDE_ON_TABLE"


-- ####
-- ####   HELPER
-- ####


makeGetFromStackBottomRequest : Session -> Int -> PlayRequest
makeGetFromStackBottomRequest session handPosition =
    {
        typeRequest = GetFromStackBottomRequest
        , gameUuid = session.gameUuid
        , playerUuid = session.playerUuid
        , cards = []
        , handPosition = handPosition
        , tablePosition = 0
    }


makeGetFromStackTopRequest : Session -> Int -> PlayRequest
makeGetFromStackTopRequest session handPosition =
    {
        typeRequest = GetFromStackTopRequest
        , gameUuid = session.gameUuid
        , playerUuid = session.playerUuid
        , cards = []
        , handPosition = handPosition
        , tablePosition = 0
    }


makePutOnStackBottomRequest : Session -> List DTOcard -> Int -> PlayRequest
makePutOnStackBottomRequest session cards handPosition =
    {
        typeRequest = PutOnStackBottomRequest
        , gameUuid = session.gameUuid
        , playerUuid = session.playerUuid
        , cards = cards
        , handPosition = handPosition
        , tablePosition = 0
    }


makeDealRequest : Session -> PlayRequest
makeDealRequest session =
    {
            typeRequest = DealRequest
            , gameUuid = session.gameUuid
            , playerUuid = session.playerUuid
            , cards = []
            , handPosition = 0
            , tablePosition = 0
    }


makePutOnTableRequest : Session -> List DTOcard -> PlayRequest
makePutOnTableRequest session cards =
    {
            typeRequest = PutOnTableRequest
            , gameUuid = session.gameUuid
            , playerUuid = session.playerUuid
            , cards = cards
            , handPosition = 0
            , tablePosition = 0
        }

makeSlideOnTableRequest : Session -> List DTOcard -> Int -> Int -> PlayRequest
makeSlideOnTableRequest session cards handPosition tablePosition =
    {
            typeRequest = SlideOnTableRequest
            , gameUuid = session.gameUuid
            , playerUuid = session.playerUuid
            , cards = cards
            , handPosition = handPosition
            , tablePosition = tablePosition
        }


