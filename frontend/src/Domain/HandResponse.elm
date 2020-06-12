module Domain.HandResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Domain.TypeResponse exposing (TypeResponse(..), typeResponseDecoder)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias HandResponse =
    {
        typeResponse : TypeResponse
        ,  cards : List DTOcard
        , handPosition : Int
    }

emptyHandResponse : HandResponse
emptyHandResponse =
    {
        typeResponse = GetResponse
        , cards = []
        , handPosition = 0
    }


-- ####
-- ####   DECODER
-- ####


handResponseDecoder : Decoder HandResponse
handResponseDecoder =
    Decode.succeed HandResponse
        |> Pipeline.required "typeResponse" typeResponseDecoder
        |> Pipeline.required "cards" ( Decode.list dtoCardDecoder )
        |> Pipeline.optional "handPosition" Decode.int 0


handResponseDecodeValue : Encode.Value -> HandResponse
handResponseDecodeValue encoded =
    case Decode.decodeValue handResponseDecoder encoded of
        Ok handResponse ->
           handResponse

        Err message ->
           emptyHandResponse
