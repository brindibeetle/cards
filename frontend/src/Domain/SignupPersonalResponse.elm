module Domain.SignupPersonalResponse exposing (..)

--
-- personal response to the player
-- -> later we will split this

import Domain.DTOgame exposing (DTOgame, dtoGameDecoder)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode


type alias SignupPersonalResponse =
    {
        gameUuid : String
        , playerUuid : String
        , typeResponse : TypeResponse
        , games : List DTOgame
    }


type TypeResponse =
     CreateResponse
    | JoinResponse
    | GamesAndPlayersResponse


emptySignupResponse : SignupPersonalResponse
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


signupResponseDecoder : Decoder SignupPersonalResponse
signupResponseDecoder =
    Decode.succeed SignupPersonalResponse
        |> Pipeline.required "gameUuid" Decode.string
        |> Pipeline.required "playerUuid" Decode.string
        |> Pipeline.required "typeResponse" typeResponseDecoder
        |> Pipeline.optional "games" ( Decode.list dtoGameDecoder ) []


typeResponseDecoder : Decoder TypeResponse
typeResponseDecoder =
    Decode.string |> Decode.andThen typeResponseFromString


typeResponseFromString : String -> Decoder TypeResponse
typeResponseFromString string =
    case Debug.log "typeResponseFromString string = " string of
        "CREATE" -> Decode.succeed CreateResponse
        "JOIN" -> Decode.succeed JoinResponse
        "GAMES_AND_PLAYERS" -> Decode.succeed GamesAndPlayersResponse
        _ -> Decode.fail ( "Invalid TypeResponse: " ++ string )


signupPersonalResponseDecodeValue : Encode.Value -> SignupPersonalResponse
signupPersonalResponseDecodeValue encoded =
    case Decode.decodeValue signupResponseDecoder encoded of
        Ok signupResponse ->
           signupResponse

        Err message ->
            let
                a = Debug.log "signupPersonalResponseDecodeValue Err " message
           in
               emptySignupResponse
