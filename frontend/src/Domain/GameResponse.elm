module Domain.GameResponse exposing (..)


import Domain.DTOplayer exposing (DTOplayer, dtoPlayerDecoder, emptyDTOplayer)
import Domain.Phase exposing (Phase(..), phaseDecoder)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias GameResponse =
    {
        phase : Phase
        , players : List DTOplayer
        , currentPlayer : DTOplayer
    }


emptyGameResponse : GameResponse
emptyGameResponse =
    {
        phase = WAITING
        , players = []
        , currentPlayer = emptyDTOplayer
    }



-- ####
-- ####   DECODER
-- ####


gameResponseDecoder : Decoder GameResponse
gameResponseDecoder =
    Decode.succeed GameResponse
        |> Pipeline.required "phase" phaseDecoder
        |> Pipeline.required "players" ( Decode.list dtoPlayerDecoder )
        |> Pipeline.required "currentPlayer" dtoPlayerDecoder


gameResponseDecodeValue : Encode.Value -> GameResponse
gameResponseDecodeValue encoded =
    case Decode.decodeValue gameResponseDecoder encoded of
        Ok gameResponse ->
           gameResponse

        Err message ->
           emptyGameResponse


