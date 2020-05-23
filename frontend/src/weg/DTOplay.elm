module Domain.DTOplay exposing (..)


import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import Session exposing (Session)


type alias CardsResponse =
    {
        placeInHand : Int
        , card : DTOcard

    }


-- request from frontend to backend to get a card
type alias CardGetRequest =
    {
        gameUuid : String
        , playerUuid : String
        , placeInHand : Int
        , place : Place
    }


-- response : the card is added to the hand
type alias CardGetResponse =
    {
        placeInHand : Int
        , card : DTOcard
    }


type Place =
    StackTop
    | StackBottom
    | Table


-- request from frontend to backend to put cards
type alias CardsPutRequest =
    {
        gameUuid : String
        , playerUuid : String
        , cards : List DTOcard
        , place : Place
        , placePosition : Int
    }


-- response : cards are removed from hand
type alias CardsPutResponse =
    {
        cards : List DTOcard
    }


-- request a deal
type alias CardsDealRequest =
    {
        gameUuid : String
        , playerUuid : String
    }


type alias CardsDealResponse =
    {
        cards : List DTOcard
    }



-- ####
-- ####   DECODER
-- ####


responseDecoder : Decoder CardsResponse
responseDecoder =
    Decode.oneOf
        [ cardGetResponseDecoder
        , cardsPutResponseDecoder
        , cardsDealResponseDecoder
        ]


cardGetResponseDecoder : Decoder CardsResponse
cardGetResponseDecoder =
    Decode.succeed
        |> Pipeline.required "placeInHand" Decode.int
        |> Pipeline.required "card" dtoCardDecoder


cardsPutResponseDecoder : Decoder CardsResponse
cardsPutResponseDecoder =
    Decode.succeed CardsPutResponse
    |> Pipeline.required "PUT" ( Decode.list dtoCardDecoder )


cardsDealResponseDecoder : Decoder CardsResponse
cardsDealResponseDecoder =
    Decode.succeed CardsPutResponse
    |> Pipeline.required "DEAL" ( Decode.list dtoCardDecoder )



-- ####
-- ####   ENCODER
-- ####


cardGetRequestEncoder : CardGetRequest -> Encode.Value
cardGetRequestEncoder { gameUuid, playerUuid, placeInHand, place } =
    Encode.object
        [ ( "gameUuid", Encode.string gameUuid )
        , ( "playerUuid", Encode.string playerUuid )
        , ( "placeInHand", Encode.int placeInHand )
        , ( "place", placeEncoder place )
        ]


cardsPutRequestEncoder : CardsPutRequest -> Encode.Value
cardsPutRequestEncoder { gameUuid, playerUuid, cards, place, placePosition } =
    Encode.object
        [ ( "gameUuid", Encode.string gameUuid )
        , ( "playerUuid", Encode.string playerUuid )
        , ( "cards", Encode.list dtoCardEncoder cards )
        , ( "place", placeEncoder place )
        , ( "placePosition", Encode.int placePosition )
        ]


placeEncoder : Place -> Encode.Value
placeEncoder place =
    case place of
        StackTop -> Encode.string "STACK-TOP"
        StackBottom -> Encode.string "STACK-BOTTOM"
        Table -> Encode.string "TABLE"


cardsDealRequestEncoder : CardsDealRequest -> Encode.Value
cardsDealRequestEncoder { gameUuid, playerUuid } =
    Encode.object
        [ ( "gameUuid", Encode.string gameUuid )
        , ( "playerUuid", Encode.string playerUuid )
        ]


-- ####
-- ####   HELPER
-- ####


makeGetRequest : Session -> Int -> Place -> CardGetRequest
makeGetRequest session placeInHand place =
     {
         gameUuid = session.gameUuid
         , playerUuid = session.playerUuid
         , placeInHand = placeInHand
         , place = place
     }


makePutRequest : Session -> List DTOcard -> Place -> Int -> CardsPutRequest
makePutRequest session cards place placePosition =
     {
         gameUuid = session.gameUuid
         , playerUuid = session.playerUuid
         , cards = cards
         , place = place
         , placePosition = placePosition
     }


makeDealRequest : Session -> CardsDealRequest
makeDealRequest session =
     {
         gameUuid = session.gameUuid
         , playerUuid = session.playerUuid
     }
