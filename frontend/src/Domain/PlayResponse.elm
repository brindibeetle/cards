module Domain.PlayResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Domain.TypeResponse exposing (TypeResponse(..), typeResponseDecoder)
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


emptyPlayResponse : PlayResponse
emptyPlayResponse =
    {
        bottomCard = defaultDTOcard
        , topCardBack = DARK
        , typeResponse = GetResponse
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


playResponseDecodeValue : Encode.Value -> PlayResponse
playResponseDecodeValue encoded =
    case Decode.decodeValue playResponseDecoder encoded of
        Ok playResponse ->
           playResponse

        Err message ->
           emptyPlayResponse
