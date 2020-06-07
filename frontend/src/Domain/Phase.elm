module Domain.Phase exposing (..)

import Json.Decode as Decode exposing (Decoder)


type Phase =
    WAITING
    | DRAW
    | PUT


phaseDecoder : Decoder Phase
phaseDecoder =
    Decode.string |> Decode.andThen phaseFromString


phaseFromString : String -> Decoder Phase
phaseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "DRAW" -> Decode.succeed DRAW
        "PUT" -> Decode.succeed PUT
        "WAITING" -> Decode.succeed WAITING
        _ -> Decode.fail ( "Invalid PhaseResponse: " ++ string )
