module Domain.DTOplayer exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias DTOplayer =
    {
        playerName : String
        , playerUuid : String
    }


emtptyDTOplayer : DTOplayer
emtptyDTOplayer =
    {
        playerName = ""
        , playerUuid = "ERROR"
    }


dtoPlayerDecoder : Decoder DTOplayer
dtoPlayerDecoder =
    Decode.succeed DTOplayer
        |> Pipeline.required "playerName" Decode.string
        |> Pipeline.required "playerUuid" Decode.string


decodeDTOGame : Encode.Value -> DTOplayer
decodeDTOGame payload =
    case Decode.decodeValue dtoPlayerDecoder payload of
        Ok dtoPlayer ->
            dtoPlayer

        Err message ->
            emtptyDTOplayer



