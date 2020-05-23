module Domain.HandResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Domain.CardsRequest exposing (Place(..))
import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import Session exposing (Session)


type alias HandResponse =
    {
        bottomCard : DTOcard
        , topCardBack : Back
        , typeResponse : TypeResponse
        , place : Place
        , cards : List DTOcard
        , handPosition : Int
        , tablePosition : Int
    }


type TypeResponse =
    PutResponse
    | GetResponse
    | DealResponse
    | SlideResponse


emptyHandResponse : HandResponse
emptyHandResponse =
    {
        bottomCard = defaultDTOcard
        , topCardBack = DARK
        , typeResponse = DealResponse
        , place = STACKBOTTOM
        , cards = []
        , handPosition = 0
        , tablePosition = 0
    }
-- ####
-- ####   DECODER
-- ####


handResponseDecoder : Decoder HandResponse
handResponseDecoder =
    Decode.succeed HandResponse
        |> Pipeline.required "bottomCard" dtoCardDecoder
        |> Pipeline.required "topCardBack" backDecoder
        |> Pipeline.required "typeResponse" typeResponseDecoder
        |> Pipeline.required "place" placeDecoder
        |> Pipeline.required "cards" ( Decode.list dtoCardDecoder )
        |> Pipeline.optional "handPosition" Decode.int 0
        |> Pipeline.optional "tablePosition" Decode.int 0


typeResponseDecoder : Decoder TypeResponse
typeResponseDecoder =
    Decode.string |> Decode.andThen typeResponseFromString

typeResponseFromString : String -> Decoder TypeResponse
typeResponseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "PUT" -> Decode.succeed PutResponse
        "SLIDE" -> Decode.succeed SlideResponse
        "GET" -> Decode.succeed GetResponse
        "DEAL" -> Decode.succeed DealResponse
        _ -> Decode.fail ( "Invalid TypeResponse: " ++ string )


placeDecoder : Decoder Place
placeDecoder =
    Decode.string |> Decode.andThen placeFromString


placeFromString : String -> Decoder Place
placeFromString string =
    case string of
        "STACKBOTTOM" -> Decode.succeed STACKBOTTOM
        "STACKTOP" -> Decode.succeed STACKTOP
        "TABLE" -> Decode.succeed TABLE
        _ -> Decode.fail ( "Invalid Place: " ++ string )


handResponseDecodeValue : Encode.Value -> HandResponse
handResponseDecodeValue encoded =
    case Decode.decodeValue handResponseDecoder encoded of
        Ok handResponse ->
           handResponse

        Err message ->
           emptyHandResponse
