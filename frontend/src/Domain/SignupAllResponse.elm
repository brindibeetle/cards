module Domain.SignupAllResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Domain.DTOgame exposing (DTOgame, dtoGameDecoder)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias SignupAllResponse =
    {
        gameUuid : String
        , typeResponse : TypeResponse
        , games : List DTOgame
    }


type TypeResponse =
     GamesAndPlayersResponse
    | StartResponse


emptySignupResponse : SignupAllResponse
emptySignupResponse =
    {
        gameUuid = ""
        , typeResponse = GamesAndPlayersResponse
        , games = []
    }


-- ####
-- ####   DECODER
-- ####


signupResponseDecoder : Decoder SignupAllResponse
signupResponseDecoder =
    Decode.succeed SignupAllResponse
        |> Pipeline.required "gameUuid" Decode.string
        |> Pipeline.required "typeResponse" typeResponseDecoder
        |> Pipeline.optional "games" ( Decode.list dtoGameDecoder ) []


typeResponseDecoder : Decoder TypeResponse
typeResponseDecoder =
    Decode.string |> Decode.andThen typeResponseFromString


typeResponseFromString : String -> Decoder TypeResponse
typeResponseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "GAMES_AND_PLAYERS" -> Decode.succeed GamesAndPlayersResponse
        "START" -> Decode.succeed StartResponse
        _ -> Decode.fail ( "Invalid TypeResponse: " ++ string )


signupAllResponseDecodeValue : Encode.Value -> SignupAllResponse
signupAllResponseDecodeValue encoded =
    case Decode.decodeValue signupResponseDecoder encoded of
        Ok signupResponse ->
           signupResponse

        Err message ->
            let
                a = Debug.log "signupAllResponseDecodeValue Err " message
           in
               emptySignupResponse
