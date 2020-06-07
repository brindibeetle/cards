module Domain.TypeResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Json.Decode as Decode exposing (Decoder)


type TypeResponse =
    PutOnTableResponse
    | SlideOnTableReponse
    | PutOnStackBottomResponse
    | GetResponse
    | DealResponse
    | StartResponse


-- ####
-- ####   DECODER
-- ####


typeResponseDecoder : Decoder TypeResponse
typeResponseDecoder =
    Decode.string |> Decode.andThen typeResponseFromString


typeResponseFromString : String -> Decoder TypeResponse
typeResponseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "PUT_ON_TABLE" -> Decode.succeed PutOnTableResponse
        "SLIDE_ON_TABLE" -> Decode.succeed SlideOnTableReponse
        "PUT_ON_STACK_BOTTOM" -> Decode.succeed PutOnStackBottomResponse
        "GET" -> Decode.succeed GetResponse
        "DEAL" -> Decode.succeed DealResponse
        "START" -> Decode.succeed StartResponse
        _ -> Decode.fail ( "Invalid TypeResponse: " ++ string )
