module Domain.DTOgame exposing (..)

import Domain.DTOplayer exposing (DTOplayer, dtoPlayerDecoder)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias DTOgame =
    {
        gameName : String
        , started : Bool
        , gameUuid : String
        , players : List DTOplayer
        , creator : String
    }


emptyDTOgame : DTOgame
emptyDTOgame =
    {
        gameName = ""
        , started = False
        , gameUuid = "ERROR"
        , players = []
        , creator = ""
    }


dtoGameDecoder : Decoder DTOgame
dtoGameDecoder =
    Decode.succeed DTOgame
        |> Pipeline.required "gameName" Decode.string
        |> Pipeline.required "started" Decode.bool
        |> Pipeline.required "gameUuid" Decode.string
        |> Pipeline.required "players" ( Decode.list dtoPlayerDecoder )
        |> Pipeline.required "creator" Decode.string


decodeDTOGame : Encode.Value -> DTOgame
decodeDTOGame payload =
    case Decode.decodeValue dtoGameDecoder payload of
        Ok dtoGame ->
            dtoGame

        Err message ->
            emptyDTOgame



