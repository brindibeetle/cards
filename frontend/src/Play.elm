port module Play exposing (..)

import Array
import Dict exposing (Dict)
import Domain.DTOcard as DTOcard exposing (Back(..), DTOcard(..), defaultDTOcard, meldSorted, meldSorter)
import Domain.DTOplayer as PlayerStatus exposing (DTOplayer, emptyDTOplayer)
import Domain.GameResponse exposing (gameResponseDecodeValue)
import Domain.HandResponse exposing (handResponseDecodeValue)
import Domain.Phase exposing (Phase(..))
import Domain.PlayRequest exposing (..)
import Domain.PlayResponse exposing (playResponseDecodeValue)
import Domain.TypeResponse exposing (TypeResponse(..))
import Html exposing (Attribute, Html, div)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick, onDoubleClick)
import Html5.DragDrop as DragDrop
import Json.Decode as Decode
import Json.Encode as Encode
import Session exposing (Session)


type alias Model =
    {
        hand : List ( DTOcard, Bool )
        , table : List ( List DTOcard )
        , topCardBack : Back
        , bottomCard : DTOcard
        , dragDrop : DragDrop.Model DragId DropId
        , phase : Phase
        , pending : Bool
        , gameName : String
        , players : List DTOplayer
        , currentPlayerUuid : String
    }


type DragId =
    DragTopCard
    | DragBottomCard
    | DragHandSelected
    | DragHand Int
    | DragTable Int

type DropId =
    DropBottomCard
    | DropHand Int
    | DropTable
    | DropTableSpace Int Int


-- refresh page :
init : Session -> Model
init session =
    { hand = []
    , table = []
    , topCardBack = DARK
    , bottomCard = defaultDTOcard
    , dragDrop = DragDrop.init
    , phase = WAITING
    , pending = False
    , gameName = ""
    , players = []
    , currentPlayerUuid = ""
    }


-- #####
-- #####   VIEW
-- #####


view : Model -> Session -> Html Msg
view model session =
    div []
        [ viewStock model session
        , viewTable model session
        , viewHand model session
        , viewGame model session
        ]


viewStock : Model -> Session -> Html Msg
viewStock model session =
    let
        { bottomCard, topCardBack, hand, table, phase } = model
    in
        if isItMyTurn model session then
            div [ class "stock-container" ]
                [ div
                    ( List.append
                        ( draggableFromBottom model )
                        ( droppableToBottom model )
                    )
                    [ div
                        [ class "stock-card" ]
                        [ DTOcard.view bottomCard ]
                    ]
                , div
                    ( draggableFromTop model )
                        [ div
                            [ class "stock-card" ]
                            [ DTOcard.viewBack topCardBack ]
                        ]
                ]
        else
            div [ class "stock-container" ]
                [ div []
                    [ div
                        [ class "stock-card" ]
                        [ DTOcard.view bottomCard ]
                    ]
                , div []
                        [ div
                            [ class "stock-card" ]
                            [ DTOcard.viewBack topCardBack ]
                        ]
                ]


-- #####   VIEW TABLE


viewTable : Model -> Session -> Html Msg
viewTable model session =
    let
        droppable = case ( isItMyTurn model session, DragDrop.getDragId model.dragDrop ) of
            ( True, Just DragHandSelected ) ->
                droppableToTable model ( List.length model.table )
            ( _, _) ->
                []
    in
        div ( class "table-container" :: droppable )
            ( List.indexedMap ( viewTableSpace model session ) model.table )


viewTableSpace : Model -> Session -> Int -> List DTOcard -> Html Msg
viewTableSpace model session index cards =
    let
        droppable = case ( isItMyTurn model session, DragDrop.getDragId model.dragDrop ) of
            ( True, Just DragHandSelected ) ->
                droppableToTable model index

            ( _, _ ) ->
                []
    in
        div ( List.append
                droppable
                [ class "table-space"]
            )
            [ div [ class "table-space-grid"]
                ( List.concat
                    [
                        [ viewTableDropSpace model session index cards DropBefore ]
                        , ( List.indexedMap (viewTableSpaceCard model session index cards) cards )
                        , [ viewTableDropSpace model session index cards DropAfter ]
                    ]
                )
            ]


viewTableSpaceCard : Model -> Session -> Int -> List DTOcard -> Int -> DTOcard -> Html Msg
viewTableSpaceCard model session tableSpaceIndex cards index card =
    let
        droppable = case ( isItMyTurn model session, card, DragDrop.getDragId model.dragDrop ) of
            ( True, Special special, Just ( DragHand i ) ) ->
                case Array.fromList model.hand |> Array.get i |> Maybe.map Tuple.first of
                    Just draggedCard ->
                        let
                            cardsAfterDrop = List.concat
                                [ List.take index cards
                                , [ draggedCard ]
                                , List.drop ( index + 1) cards
                                ]
                        in
                            if ( DTOcard.isMeld cardsAfterDrop && DTOcard.meldSorted cardsAfterDrop ) then
                                droppableToTableSpace model tableSpaceIndex index
                            else
                                []

                    Nothing ->
                        []

            ( _, _, _ ) ->
                []
    in
    div
        ( List.append
            droppable
            [ class "table-space-card" ]
        )
        [ DTOcard.view card ]


viewTableDropSpace : Model -> Session -> Int -> List DTOcard -> DropSpace -> Html Msg
viewTableDropSpace model session tableSpaceIndex cards dropSpace =
    let
        handCardsNumber = model.hand |> List.length
        droppable = case ( isItMyTurn model session && handCardsNumber > 1, DragDrop.getDragId model.dragDrop, dropSpace ) of
            ( True, Just ( DragHand i ), DropBefore ) ->
                case Array.fromList model.hand |> Array.get i |> Maybe.map Tuple.first of
                    Just draggedCard ->
                        let
                            cardsAfterDrop = draggedCard :: cards
                        in
                            if ( DTOcard.isMeld cardsAfterDrop && DTOcard.meldSorted cardsAfterDrop ) then
                                droppableToTableSpace model tableSpaceIndex -1
                            else
                                []
                    _ ->
                        []
            ( True, Just ( DragHand i ), DropAfter ) ->
                case Array.fromList model.hand |> Array.get i |> Maybe.map Tuple.first of
                    Just draggedCard ->
                        let
                            cardsAfterDrop = List.append cards [ draggedCard ]
                        in
                            if ( DTOcard.isMeld cardsAfterDrop && DTOcard.meldSorted cardsAfterDrop ) then
                                droppableToTableSpace model tableSpaceIndex 99
                            else
                                []
                    _ ->
                        []

            ( _, _, _ ) ->
                []
    in
        div
            ( List.append
                droppable
              [ class "table-space-card table-space-dropcard" ]
            )
            [ DTOcard.viewEmpty ]




type DropSpace = DropBefore | DropAfter
-- #####   VIEW HAND


viewHand : Model -> Session -> Html Msg
viewHand model session =
    let
        above = (<)
    in
        if ( handSelected model.hand True |> DTOcard.isMeld ) && ( handSelected model.hand False |> List.length |> above 0 ) then
            div ( class "hand-container"
                    :: ( draggableFromHandSelected model )
                )
                ( List.indexedMap (viewHandCard model) model.hand )
        else
            div [ class "hand-container" ]
                ( List.indexedMap (viewHandCard model) model.hand )


viewHandCard : Model -> Int -> ( DTOcard, Bool ) -> Html Msg
viewHandCard model index dtoCardSelected =
    let
        classes =
            case ( DragDrop.getDragId model.dragDrop, Tuple.second dtoCardSelected ) of
                ( Just DragHandSelected, True ) ->
                    class "hand-card hand-card-selected hand-drag-hide"

                ( Just DragHandSelected, False ) ->
                    class "hand-card hand-card-hide"

                ( Just ( DragHand i), _ ) ->
                    if index == i then
                        class "hand-card hand-drag-hide"
                    else
                        class "hand-card hand-card-hide"

                ( _, True ) ->
                    class "hand-card hand-card-selected"

                ( _, False ) ->
                    class "hand-card"

        draggable =
            if Tuple.second dtoCardSelected then
                []
            else
                draggableFromHand model index
    in
        div
            ( List.concat
                [ draggable
                , ( droppableToHand model index )
                , ( clickHand model index )
                ]
            )
            [ div
                [ classes ]
                [ DTOcard.view ( Tuple.first dtoCardSelected ) ]
            ]




-- #####   VIEW GAME


viewGame : Model -> Session -> Html Msg
viewGame model session =
    let
        a = Debug.log "viewGame players" model.players
    in
    div [ class "game-container" ]
        [ div [ class "game-header" ] [ Html.text ( "Playing " ++ session.gameName ++ " as " ++ session.playerName ) ]
        , div [ class "game-players" ] ( List.map ( viewGamePlayer model ) model.players )
        , viewGamePhase model session
        ]


viewGamePlayer : Model -> DTOplayer -> Html Msg
viewGamePlayer model player =
    if model.currentPlayerUuid == player.playerUuid then
        div [ class "game-player game-player-current" ] [ Html.text player.playerName ]
    else
        case player.playerStatus of
            PlayerStatus.PLAYING ->
                div [ class "game-player" ] [ Html.text player.playerName ]
            PlayerStatus.DISCONNECTED ->
                div [ class "game-player-disconnected" ] [ Html.text player.playerName ]
            PlayerStatus.FINISHED ->
                div [ class "game-player-finished" ] [ Html.text player.playerName ]


viewGamePhase : Model -> Session -> Html Msg
viewGamePhase model session =
    let
        activePlayers = model.players |> List.filter (\player -> (player.playerStatus == PlayerStatus.PLAYING) ) |> List.length
        a = Debug.log "viewGamePhase players = " model.players
        currentPlayer = model.players |> List.filter (\player -> (player.playerUuid == model.currentPlayerUuid) ) |> List.head

    in
        if activePlayers == 0 then
            div [ class "game-phase" ] [ Html.text ( "The game is finished." ) ]
        else
            case (model.phase,  isItMyTurn model session, currentPlayer ) of
                ( DRAW, False, Just player ) ->
                    div [ class "game-phase" ] [ Html.text ( player.playerName ++ " draws a card from the stock..." ) ]

                ( PUT, False, Just player ) ->
                    div [ class "game-phase" ] [ Html.text ( player.playerName ++ " is playing..." ) ]

                ( DRAW, True, Just player ) ->
                    div [ class "game-phase-you" ] [ Html.text ( "It is your turn! Draw a card from the stock." ) ]

                ( PUT, True, Just player ) ->
                    div [ class "game-phase-you" ] [ Html.text ( "You are playing, with putting a card to the stock your turn ends." ) ]

                ( WAITING, False, Just player ) ->
                    div [ class "game-phase" ] [ Html.text ( player.playerName ++ " is waiting for the game..." ) ]

                ( WAITING, True, _ ) ->
                    div [ class "game-phase" ] [ Html.text ( "Looks like it is your turn, need to wait a little.." ) ]

                ( _, _, _ ) ->
                    div [ class "game-phase" ] [ Html.text ( "Looks ??" ) ]

-- ####
-- ####   PORTS
-- ####


port playSend : Encode.Value -> Cmd msg
port playReceiver : (Encode.Value -> msg) -> Sub msg
port handReceiver : (Encode.Value -> msg) -> Sub msg
port gameReceiver : (Encode.Value -> msg) -> Sub msg

port dragstart : Decode.Value -> Cmd msg


-- #####
-- #####   UPDATE
-- #####


type Msg =
    PlayReceiver Encode.Value
    | HandReceiver Encode.Value
    | GameReceiver Encode.Value
    | DragDropMsg (DragDrop.Msg DragId DropId)
    | Select Int


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg }
update msg model session =
    case msg of
        GameReceiver encoded ->
            let
                { typeResponse, phase, players, currentPlayerUuid } = Debug.log "Game " ( gameResponseDecodeValue encoded )
            in
                case typeResponse of
                    Domain.GameResponse.GAME ->
                        { model =
                            { model
                            | players = players
                            , currentPlayerUuid = currentPlayerUuid
                            , phase = phase
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    Domain.GameResponse.PLAYERS ->
                        { model =
                            { model
                            | players = players
                            }
                        , session = session
                        , cmd = Cmd.none
                        }


        PlayReceiver encoded ->
            let
                { bottomCard, topCardBack, typeResponse, cards, tablePosition } = Debug.log "Play " ( playResponseDecodeValue encoded )
            in
                case typeResponse of
                    DealResponse ->
                        { model =
                            { model
                            | topCardBack = topCardBack
                            , bottomCard = bottomCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    PutOnTableResponse ->
                        { model =
                            { model
                            | table =
                                case cards of
                                    [] ->
                                        model.table
                                    _ ->
                                        tableAdd model.table cards ( Debug.log "update TABLE numberofcards" tablePosition )
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    SlideOnTableReponse ->
                        { model =
                            { model
                            | table =
                                case cards of
                                    [] ->
                                        model.table
                                    _ ->
                                        tableMod model.table cards ( Debug.log "update TABLE tablePosition" tablePosition )
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    PutOnStackBottomResponse ->
                        { model =
                            { model
                            | topCardBack = topCardBack
                            , bottomCard = bottomCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    GetResponse ->
                        { model =
                            { model
                            | topCardBack = topCardBack
                            , bottomCard = bottomCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    StartResponse ->
                        { model = model
                        , session = session
                        , cmd = makeDealRequest session |> playRequestEncoder |> playSend
                        }

        HandReceiver encoded ->
            let
                 { typeResponse, cards, handPosition } = handResponseDecodeValue encoded
            in
                case typeResponse of
                    DealResponse ->
                        let
                            a = Debug.log "DealResponse cards=" cards
                        in
                        { model =
                            { model
                            | hand = cards |> List.map (\card -> (card, False))
                            , pending = False
                            }
                        , session = session
                        , cmd = Cmd.none
                        }
                    PutOnTableResponse ->
                        { model =
                            { model
                            | hand = handCardsMergedWithResponse model.hand cards
                            , pending = False
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    SlideOnTableReponse ->
                        { model =
                            { model
                            | hand = handCardsMergedWithResponse model.hand cards
                            , pending = False
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    PutOnStackBottomResponse ->
                        { model =
                            { model
                            | hand = handCardsMergedWithResponse model.hand cards
                            , pending = False
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    GetResponse ->
                        { model =
                            { model
                            | hand = handCardsMergedWithResponse model.hand cards
                            , pending = False
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    StartResponse ->
                        { model = model
                        , session = session
                        , cmd = Cmd.none
                        }

        DragDropMsg msg_ ->
            let
                ( dragDropModel, dragDropResult ) =
                    DragDrop.update msg_ model.dragDrop

                ( model1, cmd ) =
                    case dragDropResult of
                        Nothing ->
                            (
                                { model
                                | dragDrop = dragDropModel
                                }
                                , Cmd.none
                            )
                        Just ( DragBottomCard, DropHand index, _ ) ->
                            (
                                { model
                                | dragDrop = dragDropModel
                                , pending = True
                                --, phase = PUT
                                }
                                , makeGetFromStackBottomRequest session index |> playRequestEncoder |> playSend
                            )
                        Just ( DragTopCard, DropHand index, _ ) ->
                            (
                                { model
                                | dragDrop = dragDropModel
                                , pending = True
                                --, phase = PUT
                                }
                                , makeGetFromStackTopRequest session index |> playRequestEncoder |> playSend
                            )
                        Just ( DragHand index, DropBottomCard, _ ) ->
                            case getHandCard model index of
                                Just card ->
                                    (
                                        { model
                                        | dragDrop = dragDropModel

                                        , pending = True
                                        --, phase = DRAW
                                        }
                                        , makePutOnStackBottomRequest session [ card ] index |> playRequestEncoder |> playSend
                                    )

                                Nothing ->
                                    (
                                        { model
                                        | dragDrop = dragDropModel
                                        }
                                        , Cmd.none
                                    )

                        Just ( DragHand from, DropHand to, _ ) ->
                            case getHandCard model from of
                                Just card ->
                                    (
                                        { model
                                        | dragDrop = dragDropModel
                                        , hand = handMove model.hand from to
                                        }
                                        , Cmd.none
                                    )

                                Nothing ->
                                    (
                                        { model
                                        | dragDrop = dragDropModel
                                        }
                                        , Cmd.none
                                    )

                        Just ( DragHandSelected, DropTable, _ ) ->
                            let
                                cards = Debug.log "DragHandSelected, DropTable " ( handSelected model.hand True )
                                    |> (\cards1 -> if meldSorted cards1 then cards1 else meldSorter cards1)
                            in
                            (
                                { model
                                | dragDrop = dragDropModel
                                , pending = True
                                }
                                , makePutOnTableRequest session cards |> playRequestEncoder |> playSend
                            )

                        Just ( DragHand from, DropTableSpace toTable toIndex, _ ) ->
                            case
                                ( Array.fromList model.hand |> Array.get from |> Maybe.map Tuple.first
                                , Array.fromList model.table |> Array.get toTable
                                )
                            of
                                ( Just draggedCard, Just tableCards ) ->
                                    let
                                        cardsAfterDrop = List.concat
                                            [ List.take toIndex tableCards
                                            , [ draggedCard ]
                                            , List.drop ( toIndex + 1) tableCards
                                            ]
                                    in
                                    (
                                        { model
                                        | dragDrop = dragDropModel
                                        , pending = True
                                        }
                                        , makeSlideOnTableRequest session cardsAfterDrop from toTable |> playRequestEncoder |> playSend
                                        --, playSend ( dtoPlayEncoder ( DTOplay.makeTableMod session cards to ) )
                                    )

                                ( _, _ ) ->
                                    (
                                        { model
                                        | dragDrop = dragDropModel
                                        }
                                        , Cmd.none
                                    )

                        Just (_, _, _ ) ->
                            (
                                { model
                                | dragDrop = dragDropModel
                                }
                                , Cmd.none
                            )
            in
                { model = model1
                , session = session
                , cmd = Cmd.batch
                        [ cmd
                        , DragDrop.getDragstartEvent msg_
                            |> Maybe.map (.event >> dragstart)
                            |> Maybe.withDefault Cmd.none
                        ]
                }

        Select int ->
            { model =
                { model
                | hand = List.indexedMap (\i ( card, selected ) -> if i == int then ( card, not selected ) else ( card, selected ) )  model.hand
                }
                , session = session
                , cmd = Cmd.none
            }


-- #####
-- #####   SUBSCRIPTIONS
-- #####


subscriptions : Sub Msg
subscriptions =
    Sub.batch
    [ playReceiver PlayReceiver
    , handReceiver HandReceiver
    , gameReceiver GameReceiver
    ]


-- #####
-- #####   HELPER
-- #####


getHandCard : Model -> Int -> Maybe DTOcard
getHandCard model index =
    model.hand |> Array.fromList |> Array.get index |> Maybe.map Tuple.first


getHandSelect : Model -> Int -> Bool
getHandSelect model index =
    model.hand |> Array.fromList |> Array.get index |> Maybe.map Tuple.second |> Maybe.withDefault False


handAdd: List ( DTOcard, Bool ) -> List DTOcard -> Int -> List ( DTOcard, Bool )     -- 0,1,2,3,4     7  2 => 0,1,2,7,3,4
handAdd hand cards index =
    List.concat
        [
            List.take (index + 1) hand                           -- 0,1,2
            , cards |> List.map (\card -> (card, False))         -- 7
            , List.drop (index + 1) hand                         -- 3,4
        ]


handRemove: List ( DTOcard, Bool ) -> Int -> List ( DTOcard, Bool )
handRemove hand index =
    --only 1 card is removed if the same card has multiple occurrences
    List.concat
        [ List.take index hand              -- 0,1
        , List.drop ( index + 1 ) hand      -- 3,4
        ]


handMove: List ( DTOcard, Bool ) -> Int -> Int -> List ( DTOcard, Bool )
handMove hand from to =
    if from == to then
        hand
    else if from < to then                                                      -- 0,1,2,3,4,5,6,7,8  2 5
        List.concat                                                             -- => 0,1,3,4,5,2,6,7,8
            [
                List.take from hand                                             -- 0,1
                , List.drop ( from + 1 ) hand |> List.take ( to - from )        -- 3,4,5
                , List.drop from hand |> List.take 1                            -- 2
                , List.drop (to + 1) hand                                       -- 6,7,8
            ]
    else                                                                        -- 0,1,2,3,4,5,6,7,8  5 2
        List.concat                                                             -- => 0,1,5,2,3,4,6,7,8
            [
                List.take ( to + 1 ) hand                                       -- 0,1,2
                , List.drop from hand |> List.take 1                            -- 5
                , List.drop ( to + 1 ) hand |> List.take ( from - to - 1 )      -- 3,4
                , List.drop (from + 1) hand                                     -- 6,7,8
            ]


draggableFromHand: Model -> Int -> List (Attribute Msg)
draggableFromHand model index =
    if model.pending then
        []

    else
        DragDrop.draggable DragDropMsg ( DragHand index )


draggableFromHandSelected: Model -> List (Attribute Msg)
draggableFromHandSelected model =
    if model.pending then
        []

    else
        DragDrop.draggable DragDropMsg ( DragHandSelected )


droppableToHand: Model -> Int -> List (Attribute Msg)
droppableToHand model index =
    case ( model.pending, model.phase, DragDrop.getDragId model.dragDrop ) of
        ( True, _, _) ->
            []

        ( _, DRAW, _ ) ->
            DragDrop.droppable DragDropMsg ( DropHand index )

        ( _, _, Just ( DragHand indexFrom) ) ->
            DragDrop.droppable DragDropMsg ( DropHand index )

        ( _, _, _ ) ->
            []


draggableFromBottom: Model -> List (Attribute Msg)
draggableFromBottom model =
    case ( model.pending, model.phase ) of
        ( False, DRAW ) ->
            DragDrop.draggable DragDropMsg DragBottomCard

        ( _, _ ) ->
            []


droppableToBottom: Model -> List (Attribute Msg)
droppableToBottom model =
    case ( model.pending, model.phase ) of
        ( False, PUT ) ->
            DragDrop.droppable DragDropMsg DropBottomCard

        ( _, _ ) ->
            []


draggableFromTop: Model -> List (Attribute Msg)
draggableFromTop model =
    case ( model.pending, model.phase ) of
        ( False, DRAW ) ->
            DragDrop.draggable DragDropMsg DragTopCard

        ( _, _ ) ->
            []


clickHand: Model -> Int -> List (Attribute Msg)
clickHand model index =
    case ( model.pending, model.phase ) of
        ( False, PUT ) ->
            [ onClick ( Select index ) ]

        ( _, _ ) ->
            []


droppableToTable: Model -> Int -> List (Attribute Msg)
droppableToTable model index =
    case ( model.pending, model.phase, DragDrop.getDragId model.dragDrop ) of
        ( True, _, _ ) ->
            []

        ( _, PUT, _ ) ->
            DragDrop.droppable DragDropMsg DropTable

        ( _, _, _ ) ->
            []


droppableToTableSpace: Model -> Int -> Int -> List (Attribute Msg)
droppableToTableSpace model tableSpaceIndex index =
    case ( model.pending, model.phase, DragDrop.getDragId model.dragDrop ) of
        ( True, _, _ ) ->
            []

        ( _, PUT, _ ) ->
            DragDrop.droppable DragDropMsg ( DropTableSpace tableSpaceIndex index )

        ( _, _, _ ) ->
            []


handSelected: List ( DTOcard, Bool ) -> Bool -> List DTOcard
handSelected dtoCardSelected selectFilter =
    dtoCardSelected |> List.filter (\(dtoCard, selected) -> selectFilter == selected ) |> List.map Tuple.first


tableAdd: List ( List DTOcard ) -> List DTOcard -> Int -> List ( List DTOcard )
tableAdd table cards index =
    List.concat
    [
        List.take (index + 1) table                           -- 0,1,2
        , [ cards ]
        , List.drop (index + 1) table                         -- 3,4
    ]


tableMod: List ( List DTOcard ) -> List DTOcard -> Int -> List ( List DTOcard )
tableMod table cards index =
    List.concat
    [
        List.take (index ) table                              -- 0,1
        , [ cards ]
        , List.drop (index + 1) table                         -- 3,4
    ]


removeFromHand :  Int ->  List ( DTOcard, Bool ) -> List ( DTOcard, Bool )
removeFromHand index dtoCardSelected =
    List.concat
    [
        List.take index dtoCardSelected                     -- 0,1
        , List.drop ( index + 1 ) dtoCardSelected           -- 3,4
    ]

addToHand : Int -> List DTOcard ->  List ( DTOcard, Bool ) -> List ( DTOcard, Bool )
addToHand index cards dtoCardSelected =
    List.concat
    [
        List.take index dtoCardSelected                     -- 0,1
        , List.map (\card -> (card, True)) cards
        , List.drop index dtoCardSelected                   -- 2,3,4
    ]


isItMyTurn : Model -> Session -> Bool
isItMyTurn model session =
    model.currentPlayerUuid == session.playerUuid


cardsToDict : List DTOcard -> Dict String DTOcard
cardsToDict dtoCards =
    List.map ( \dtoCard -> ( DTOcard.getUUID dtoCard, dtoCard ) ) dtoCards |> Dict.fromList


handCardsMergedWithResponse : List ( DTOcard, Bool ) -> List DTOcard ->  List ( DTOcard, Bool )
handCardsMergedWithResponse handCards responseCards =
    let
        handCardsInResponse = handCards |> List.filterMap (\(dtoCard, _ ) -> ( if List.member dtoCard responseCards then Just dtoCard else Nothing ) )
        responseNotInHand = responseCards |> List.filter (\dtoCard -> not ( List.member dtoCard handCardsInResponse) )
    in
        List.append
            ( List.map ( \dtoCard -> (dtoCard, False ) ) handCardsInResponse )
            ( List.map ( \dtoCard -> (dtoCard, True ) ) responseNotInHand )
