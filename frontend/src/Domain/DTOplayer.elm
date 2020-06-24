module Domain.DTOplayer exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias DTOplayer =
    {
        playerName : String
        , playerUuid : String
        , playerStatus : PlayerStatus
    }


emptyDTOplayer : DTOplayer
emptyDTOplayer =
    {
        playerName = ""
        , playerUuid = "ERROR"
        , playerStatus = PLAYING
    }

type PlayerStatus = PLAYING | FINISHED | DISCONNECTED

dtoPlayerDecoder : Decoder DTOplayer
dtoPlayerDecoder =
    Decode.succeed DTOplayer
        |> Pipeline.required "playerName" Decode.string
        |> Pipeline.required "playerUuid" Decode.string
        |> Pipeline.required "playerStatus" playerStatusDecoder


playerStatusDecoder : Decoder PlayerStatus
playerStatusDecoder =
     Decode.string |> Decode.andThen playerStatusFromString


playerStatusFromString : String -> Decoder PlayerStatus
playerStatusFromString string =
    case string of
        "PLAYING" -> Decode.succeed PLAYING
        "FINISHED" -> Decode.succeed FINISHED
        "DISCONNECTED" -> Decode.succeed DISCONNECTED
        _ -> Decode.fail ( "Invalid PlayerStatus: " ++ string )


decodeDTOGame : Encode.Value -> DTOplayer
decodeDTOGame payload =
    case Decode.decodeValue dtoPlayerDecoder payload of
        Ok dtoPlayer ->
            dtoPlayer

        Err message ->
            emptyDTOplayer



