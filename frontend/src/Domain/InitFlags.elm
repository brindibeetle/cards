module Domain.InitFlags exposing (..)

import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline exposing (..)

type alias InitFlags =
    {
        backend_base_url : String
        , frontend_url : String
    }

-- Opaque
emptyInitFlags : InitFlags
emptyInitFlags =
    {
        backend_base_url = ""
        , frontend_url = ""
    }


initFlagsBookDecoder : Decode.Decoder InitFlags
initFlagsBookDecoder =
    Decode.succeed InitFlags
        |> required "backend_base_url" string
        |> required "frontend_url" string



getInitFlags : String -> InitFlags
getInitFlags dvalue =
    case Decode.decodeString initFlagsBookDecoder dvalue  of

        Result.Ok initFlags ->
            initFlags
    
        Result.Err a ->
            emptyInitFlags