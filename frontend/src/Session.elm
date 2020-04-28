module Session exposing (..)

import Bootstrap.Navbar as Navbar
import RemoteData exposing (RemoteData, WebData, succeed)

import Domain.InitFlags exposing (..)

type alias Session =
    { page : Page
    , message : Message
    , initFlags : InitFlags
    }


type Message =
    Empty
    | Succeeded String
    | Warning String
    | Error String
            
            
initialSession : InitFlags -> Session
initialSession initFlags =
    { page = SignupPage
    , message = Empty
    , initFlags = initFlags
    }

succeed : Session -> String -> Session
succeed session message =
    { session 
    | message = Succeeded message
    , page = SignupPage }

succeed1 : Session -> String -> Session
succeed1 session message =
    { session 
    | message = Succeeded message
    , page = SignupPage }

fail : Session -> String -> Session
fail session message =
    { session 
    | message = Error message
    , page = SignupPage }


warn : Session -> String -> Session
warn session message =
    { session 
    | message = Warning message
    , page = SignupPage }


changedPageSession : Page -> Session ->  Session
changedPageSession page session =
    { session
    | page = page
    , message = Empty
    }


type Page
    = SignupPage


getSudokuApiBaseUrl : Session -> String
getSudokuApiBaseUrl session =
    session.initFlags.sudoku_api_base_url