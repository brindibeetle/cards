module Domain.DTOplay exposing (..)

import Domain.DTOcard exposing (Back(..), DTOcard, backDecoder, defaultDTOcard, dtoCardDecoder, dtoCardEncoder, meldSorter)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode
import Session exposing (Session)


type alias DTOplay =
    {
        gameUuid : String
        , playerUuid : String
        , cards : List DTOcard
        , numberOfCards : Int
        , action : Action
        , topCardBack : Back
        , bottomCard : DTOcard
    }


type Action =
    TABLE
    | DEAL
    | PUT
    | GET
    | DRAW


emptyDTOplay : DTOplay
emptyDTOplay =
    {
        gameUuid = "ERROR"
        , playerUuid = ""
        , cards = []
        , numberOfCards = 0
        , action = TABLE
        , topCardBack = DARK
        , bottomCard = defaultDTOcard
    }


-- ####
-- ####   DECODER
-- ####


dtoPlayDecoder : Decoder DTOplay
dtoPlayDecoder =
    Decode.succeed DTOplay
        |> Pipeline.required "gameUuid" Decode.string
        |> Pipeline.required "playerUuid" Decode.string
        |> Pipeline.required "cards" (Decode.list dtoCardDecoder)
        |> Pipeline.required "numberOfCards" Decode.int
        |> Pipeline.required "action" actionDecoder
        |> Pipeline.required "topCardBack" backDecoder
        |> Pipeline.required "bottomCard" dtoCardDecoder


actionDecoder : Decoder Action
actionDecoder =
    Decode.string |> Decode.andThen actionFromString


actionFromString : String -> Decoder Action
actionFromString string =
    case string of
        "TABLE" -> Decode.succeed TABLE
        "DEAL" -> Decode.succeed DEAL
        "PUT" -> Decode.succeed PUT
        "GET" -> Decode.succeed GET
        "DRAW" -> Decode.succeed DRAW
        _ -> Decode.fail ( "Invalid action: " ++ string )


dtoPlayDecodeValue : Encode.Value -> DTOplay
dtoPlayDecodeValue encoded =
    case Decode.decodeValue dtoPlayDecoder encoded of
        Ok dtoPlay ->
            dtoPlay

        Err message ->
            emptyDTOplay


-- ####
-- ####   ENCODER
-- ####


dtoPlayEncoder : DTOplay -> Encode.Value
dtoPlayEncoder { gameUuid, playerUuid, cards, numberOfCards, action } =
    Encode.object
        [ ( "gameUuid", Encode.string gameUuid )
        , ( "playerUuid", Encode.string playerUuid )
        , ( "cards", Encode.list dtoCardEncoder cards )
        , ( "numberOfCards", Encode.int numberOfCards )
        , ( "action", actionEncoder action )
        ]


actionEncoder : Action -> Encode.Value
actionEncoder action =
    case action of
        TABLE -> Encode.string "TABLE"
        DEAL -> Encode.string "DEAL"
        PUT -> Encode.string "PUT"
        GET -> Encode.string "GET"
        DRAW -> Encode.string "DRAW"


-- ####
-- ####   HELPER
-- ####


makeGet : Session -> Int -> DTOplay
makeGet session index =
     {
         gameUuid = session.gameUuid
         , playerUuid = session.playerUuid
         , cards = []
         , numberOfCards = index
         , action = GET
         , topCardBack = DARK
         , bottomCard = defaultDTOcard
     }


makeDraw : Session -> Int -> DTOplay
makeDraw session index =
     {
         gameUuid = session.gameUuid
         , playerUuid = session.playerUuid
         , cards = []
         , numberOfCards = index
         , action = DRAW
         , topCardBack = DARK
         , bottomCard = defaultDTOcard
     }


makePut : Session -> DTOcard -> Int -> DTOplay
makePut session dtoCard index =
     {
         gameUuid = session.gameUuid
         , playerUuid = session.playerUuid
         , cards = [ dtoCard ]
         , numberOfCards = index
         , action = PUT
         , topCardBack = DARK
         , bottomCard = defaultDTOcard
     }


makeTable : Session -> List ( DTOcard, Bool ) -> Int -> DTOplay
makeTable session dtoCardSelecteds tableSpace =
     {
         gameUuid = session.gameUuid
         , playerUuid = session.playerUuid
         , cards = Debug.log "makeTable" ( dtoCardSelecteds |> List.filterMap (\(dtoCard, selected) -> if selected then Just dtoCard else Nothing ) |> meldSorter )
         , numberOfCards = tableSpace
         , action = TABLE
         , topCardBack = DARK
         , bottomCard = defaultDTOcard
     }
