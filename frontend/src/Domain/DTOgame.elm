module Domain.DTOgame exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
type alias DTOgame =
    {
        gameUuid : String
        , playerUuid : String
    }


emtptyDTOgame : DTOgame
emtptyDTOgame =
    {
        gameUuid = "ERROR"
        , playerUuid = ""
    }


dtoGameDecoder : Decoder DTOgame
dtoGameDecoder =
    Decode.succeed DTOgame
        |> Pipeline.required "gameUuid" Decode.string
        |> Pipeline.required "playerUuid" Decode.string


decodeDTOGame : Encode.Value -> DTOgame
decodeDTOGame payload =
    case Decode.decodeValue dtoGameDecoder payload of
        Ok dtoGame ->
            dtoGame

        Err message ->
            emtptyDTOgame



