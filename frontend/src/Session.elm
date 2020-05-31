module Session exposing (..)

import Bootstrap.Navbar as Navbar
import Domain.DTOgame exposing (DTOgame)

import Domain.InitFlags exposing (..)

type alias Session =
    { message : Message
    , initFlags : InitFlags
    , playerName : String
    , playerUuid : String
    , gameUuid : String
    , gameName : String
    }


type Message =
    Empty
    | Succeeded String
    | Warning String
    | Error String
            
            
initialSession : InitFlags -> Session
initialSession initFlags =
    { message = Empty
    , initFlags = initFlags
    , playerName = ""
    , playerUuid = ""
    , gameUuid = ""
    , gameName = ""
    }

succeed : Session -> String -> Session
succeed session message =
    { session 
    | message = Succeeded message }

succeed1 : Session -> String -> Session
succeed1 session message =
    { session 
    | message = Succeeded message }

fail : Session -> String -> Session
fail session message =
    { session 
    | message = Error message }


warn : Session -> String -> Session
warn session message =
    { session 
    | message = Warning message }


--type Page
--    = SignupPage
--    | PlayPage
--

-- ####
-- ####   HELPER
-- ####

