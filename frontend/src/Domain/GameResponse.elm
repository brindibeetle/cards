module Domain.GameResponse exposing (..)


import Domain.DTOplayer exposing (DTOplayer, dtoPlayerDecoder, emptyDTOplayer)
import Domain.Phase exposing (Phase(..), phaseDecoder)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias GameResponse =
    {
        typeResponse : TypeResponse
        , phase : Phase
        , players : List DTOplayer
        , currentPlayerUuid : String
    }


type TypeResponse =
    GAME
    | PLAYERS


emptyGameResponse : GameResponse
emptyGameResponse =
    {
        typeResponse = GAME
        , phase = WAITING
        , players = []
        , currentPlayerUuid =  ""
    }



-- ####
-- ####   DECODER
-- ####


gameResponseDecoder : Decoder GameResponse
gameResponseDecoder =
    Decode.succeed GameResponse
        |> Pipeline.required "typeResponse" typeResponseDecoder
        |> Pipeline.required "phase" phaseDecoder
        |> Pipeline.required "players" ( Decode.list dtoPlayerDecoder )
        |> Pipeline.required "currentPlayerUuid" Decode.string


gameResponseDecodeValue : Encode.Value -> GameResponse
gameResponseDecodeValue encoded =
    case Decode.decodeValue gameResponseDecoder encoded of
        Ok gameResponse ->
           gameResponse

        Err message ->
           emptyGameResponse


typeResponseDecoder : Decoder TypeResponse
typeResponseDecoder =
    Decode.string |> Decode.andThen typeResponseFromString


typeResponseFromString : String -> Decoder TypeResponse
typeResponseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "GAME" -> Decode.succeed GAME
        "PLAYERS" -> Decode.succeed PLAYERS
        _ -> Decode.fail ( "Invalid typeResponseFromString: " ++ string )

