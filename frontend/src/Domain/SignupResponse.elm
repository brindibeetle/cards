module Domain.SignupResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias SignupResponse =
    {
        gameUuid : String
        , playerUuid : String
        , typeResponse : TypeResponse
        , games : List String
    }


type TypeResponse =
     CreateResponse
    | JoinResponse
    | GamesResponse
    | StartResponse


emptySignupResponse : SignupResponse
emptySignupResponse =
    {
        gameUuid = ""
        , playerUuid = ""
        , typeResponse = CreateResponse
        , games = []
    }
-- ####
-- ####   DECODER
-- ####


signupResponseDecoder : Decoder SignupResponse
signupResponseDecoder =
    Decode.succeed SignupResponse
        |> Pipeline.required "gameUuid" Decode.string
        |> Pipeline.required "playerUuid" Decode.string
        |> Pipeline.required "typeResponse" typeResponseDecoder
        |> Pipeline.optional "games" ( Decode.list Decode.string ) []


typeResponseDecoder : Decoder TypeResponse
typeResponseDecoder =
    Decode.string |> Decode.andThen typeResponseFromString


typeResponseFromString : String -> Decoder TypeResponse
typeResponseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "CREATE" -> Decode.succeed CreateResponse
        "JOIN" -> Decode.succeed JoinResponse
        "GAMES" -> Decode.succeed GamesResponse
        "START" -> Decode.succeed StartResponse
        _ -> Decode.fail ( "Invalid TypeResponse: " ++ string )


signupResponseDecodeValue : Encode.Value -> SignupResponse
signupResponseDecodeValue encoded =
    case Decode.decodeValue signupResponseDecoder encoded of
        Ok signupResponse ->
           signupResponse

        Err message ->
           emptySignupResponse
