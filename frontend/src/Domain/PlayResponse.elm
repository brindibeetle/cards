module Domain.PlayResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias PlayResponse =
    {
        bottomCard : DTOcard
        , topCardBack : Back
        , typeResponse : TypeResponse
        , cards : List DTOcard
        , handPosition : Int
        , tablePosition : Int
    }


type TypeResponse =
    PutOnTableResponse
    | SlideOnTableReponse
    | DealResponse
    | PutOnStackBottomResponse
    | GetResponse


emptyPlayResponse : PlayResponse
emptyPlayResponse =
    {
        bottomCard = defaultDTOcard
        , topCardBack = DARK
        , typeResponse = DealResponse
        , cards = []
        , handPosition = 0
        , tablePosition = 0
    }
-- ####
-- ####   DECODER
-- ####


playResponseDecoder : Decoder PlayResponse
playResponseDecoder =
    Decode.succeed PlayResponse
        |> Pipeline.required "bottomCard" dtoCardDecoder
        |> Pipeline.required "topCardBack" backDecoder
        |> Pipeline.required "typeResponse" typeResponseDecoder
        |> Pipeline.required "cards" ( Decode.list dtoCardDecoder )
        |> Pipeline.optional "handPosition" Decode.int 0
        |> Pipeline.optional "tablePosition" Decode.int 0


typeResponseDecoder : Decoder TypeResponse
typeResponseDecoder =
    Decode.string |> Decode.andThen typeResponseFromString

typeResponseFromString : String -> Decoder TypeResponse
typeResponseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "PUT_ON_TABLE" -> Decode.succeed PutOnTableResponse
        "SLIDE_ON_TABLE" -> Decode.succeed SlideOnTableReponse
        "DEAL" -> Decode.succeed DealResponse
        "PUT_ON_STACK_BOTTOM" -> Decode.succeed PutOnStackBottomResponse
        "GET" -> Decode.succeed GetResponse
        _ -> Decode.fail ( "Invalid TypeResponse: " ++ string )


playResponseDecodeValue : Encode.Value -> PlayResponse
playResponseDecodeValue encoded =
    case Decode.decodeValue playResponseDecoder encoded of
        Ok playResponse ->
           playResponse

        Err message ->
           emptyPlayResponse
