module Domain.CardsRequest exposing (..)


import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Json.Encode as Encode
import Session exposing (Session)


type alias CardsRequest =
    {
        typeRequest : TypeRequest
        , gameUuid : String
        , playerUuid : String
        , cards : List DTOcard
        , handPosition : Int
        , tablePosition : Int
        , place : Place
    }


type TypeRequest =
    GetRequest
    | PutRequest
    | DealRequest
    | SlideRequest


type Place =
    STACKTOP
    | STACKBOTTOM
    | TABLE


-- ####
-- ####   ENCODER
-- ####


cardsRequestEncoder : CardsRequest -> Encode.Value
cardsRequestEncoder { typeRequest, gameUuid, playerUuid, cards, handPosition, tablePosition , place } =
    Encode.object
        [ ( "typeRequest", typeRequestEncoder typeRequest )
        , ( "gameUuid", Encode.string gameUuid )
        , ( "playerUuid", Encode.string playerUuid )
        , ( "cards", Encode.list dtoCardEncoder cards )
        , ( "handPosition", Encode.int handPosition )
        , ( "tablePosition", Encode.int tablePosition )
        , ( "place", placeEncoder place )
        ]


typeRequestEncoder : TypeRequest -> Encode.Value
typeRequestEncoder typeRequest =
    case typeRequest of
        GetRequest -> Encode.string "GET"
        PutRequest -> Encode.string "PUT"
        SlideRequest -> Encode.string "SLIDE"
        DealRequest -> Encode.string "DEAL"


placeEncoder : Place -> Encode.Value
placeEncoder place =
    case place of
        STACKBOTTOM -> Encode.string "STACKBOTTOM"
        STACKTOP -> Encode.string "STACKTOP"
        TABLE -> Encode.string "TABLE"



-- ####
-- ####   HELPER
-- ####


makeDealRequest : Session -> CardsRequest
makeDealRequest session =
    {
            typeRequest = DealRequest
            , gameUuid = session.gameUuid
            , playerUuid = session.playerUuid
            , cards = []
            , handPosition = 0
            , tablePosition = 0
            , place = STACKTOP
        }


makePutRequest : Session -> List DTOcard -> Int -> Int -> Place -> CardsRequest
makePutRequest session cards handPosition tablePosition place =
    {
            typeRequest = PutRequest
            , gameUuid = session.gameUuid
            , playerUuid = session.playerUuid
            , cards = cards
            , handPosition = handPosition
            , tablePosition = tablePosition
            , place = place
        }


makeSlideRequest : Session -> List DTOcard -> Int -> Int -> Place -> CardsRequest
makeSlideRequest session cards handPosition tablePosition place =
    {
            typeRequest = SlideRequest
            , gameUuid = session.gameUuid
            , playerUuid = session.playerUuid
            , cards = cards
            , handPosition = handPosition
            , tablePosition = tablePosition
            , place = place
        }


makeGetRequest : Session -> Int -> Place -> CardsRequest
makeGetRequest session handPosition place =
    {
            typeRequest = GetRequest
            , gameUuid = session.gameUuid
            , playerUuid = session.playerUuid
            , cards = []
            , handPosition = handPosition
            , tablePosition = 0
            , place = place
        }