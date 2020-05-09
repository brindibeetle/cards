port module Play exposing (..)

import Array
import Domain.DTOcard as DTOcard exposing (Back(..), DTOcard, defaultDTOcard)
import Domain.DTOgame exposing (DTOgame)
import Domain.DTOplay as DTOplay exposing (Action(..), DTOplay, dtoPlayDecodeValue, dtoPlayDecoder, dtoPlayEncoder, makeGet)
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
        , dragDrop : DragDrop.Model DragDropLocation DragDropLocation
        , phase : Phase
    }


type Phase =
    Waiting
    | Pending       -- awaiting some interaction with server
    | DrawCard
    | PutCard


type DragDropLocation =
    TopCard
    | BottomCard
    | Hand Int
    | Table Int


-- refresh page :
init : DTOgame -> ( Model, Cmd Msg )
init { playerUuid, gameUuid } =
    let
        dtoPlay = { playerUuid = playerUuid, gameUuid = gameUuid, cards = [], numberOfCards = 13, action = DEAL, topCardBack = DARK, bottomCard = defaultDTOcard }
    in
        (
            { hand = []
            , table = []
            , topCardBack = DARK
            , bottomCard = defaultDTOcard
            , dragDrop = DragDrop.init
            , phase = DrawCard
            }
            , playSend (Debug.log "Play.init" (dtoPlayEncoder dtoPlay ) )
        )


-- #####
-- #####   VIEW
-- #####


view : Model -> Html Msg
view model =
    let
        { bottomCard, topCardBack, hand, table, phase } = model
    in
        div []
            [ div [ class "stock-container" ]
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
            , div ( class "table-container" :: droppableToTableSpace model 0 )
                ( List.indexedMap (viewTableSpace model) table )
            , div [ class "hand-container" ]
                ( List.indexedMap (viewHand model) hand )
            ]


viewHand : Model -> Int -> ( DTOcard, Bool ) -> Html Msg
viewHand model index dtoCardSelected =
    div
        ( List.concat
            [ ( draggableFromHand model index )
            , ( droppableToHand model index )
            , ( clickHand model index )
            ]
        )
        [ div
            [ if Tuple.second dtoCardSelected then class "hand-card hand-card-selected" else class "hand-card" ]
            [ DTOcard.view ( Tuple.first dtoCardSelected ) ]
        ]


viewTableSpace : Model -> Int -> List DTOcard -> Html Msg
viewTableSpace model index cards =
    div
        ( droppableToTableSpace model index )
        [ div
            [ class "table-space"]
            ( List.indexedMap (viewTableSpaceCard model) cards )
        ]


viewTableSpaceCard : Model -> Int -> DTOcard -> Html Msg
viewTableSpaceCard model index card =
    div
        []
        [ div
            [ class "table-space-card"]
            [ DTOcard.view card ]
        ]


-- ####
-- ####   PORTS
-- ####


port playSend : Encode.Value -> Cmd msg
port playReceiver : (Encode.Value -> msg) -> Sub msg

port dragstart : Decode.Value -> Cmd msg


-- #####
-- #####   UPDATE
-- #####


type Msg =
    Receiver Encode.Value
    | DragDropMsg (DragDrop.Msg DragDropLocation DragDropLocation)
    | Select Int


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg }
update msg model session =
    case msg of
        Receiver encoded ->
            let
                 { action, cards, topCardBack, bottomCard, numberOfCards } = dtoPlayDecodeValue ( Debug.log "Receiver encoded " encoded )
            in
                case action of
                    TABLE ->
                        { model =
                            { model
                            | hand = handRemoveSelected model.hand
                            , table = tableAdd model.table cards numberOfCards
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = PutCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    DEAL ->
                        { model =
                            { model
                            | hand = cards |> List.map (\card -> (card, False))
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = DrawCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    PUT ->
                        { model =
                            { model
                            | hand = handRemove model.hand numberOfCards
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = DrawCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    GET ->
                        { model =
                            { model
                            | hand = handAdd model.hand cards numberOfCards
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = PutCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    DRAW ->
                        { model =
                            { model
                            | hand = handAdd model.hand cards numberOfCards
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = PutCard
                            }
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
                        Just ( BottomCard, Hand index, _ ) ->
                            let
                                dtoPlay = DTOplay.makeGet session index
                            in
                            (
                                { model
                                | dragDrop = dragDropModel
                                , phase = Pending
                                }
                                , playSend (Debug.log "Just ( BottomCard, Hand int" (dtoPlayEncoder dtoPlay ) )
                            )
                        Just ( TopCard, Hand index, _ ) ->
                            let
                                dtoPlay = DTOplay.makeDraw session index
                            in
                            (
                                { model
                                | dragDrop = dragDropModel
                                , phase = Pending
                                }
                                , playSend (Debug.log "Just ( BottomCard, Hand int" (dtoPlayEncoder dtoPlay ) )
                            )
                        Just ( Hand index, BottomCard, _ ) ->
                            case getHandCard model index of
                                Just dtoCard ->
                                    let
                                        dtoPlay = DTOplay.makePut session dtoCard index
                                    in
                                    (
                                        { model
                                        | dragDrop = dragDropModel
                                        , phase = Pending
                                        }
                                        , playSend (Debug.log "Just ( Hand int, BottomCard" (dtoPlayEncoder dtoPlay ) )
                                    )

                                Nothing ->
                                    ( model, Cmd.none )

                        Just ( Hand from, Hand to, _ ) ->
                            case getHandCard model from of
                                Just card ->
                                    let
                                        a = Debug.log "Hand from to hand from " from
                                        b = Debug.log "Hand from to hand to " to
                                    in
                                    (
                                        { model
                                        | hand = handMove model.hand from to
                                        }
                                        , Cmd.none
                                    )

                                Nothing ->
                                     ( model, Cmd.none )

                        Just ( Hand from, Table to, _ ) ->
                            let
                                dtoPlay = DTOplay.makeTable session model.hand to
                            in
                            (
                                { model
                                | dragDrop = dragDropModel
                                , phase = Pending
                                }
                                , playSend (Debug.log "Just ( Hand int, Table to " (dtoPlayEncoder dtoPlay ) )
                            )

                        Just (_, _, _ ) ->
                            ( model, Cmd.none )
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
            let
                a = Debug.log "Select int " int
            in
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


subscriptions : Model -> Sub Msg
subscriptions _ =
    playReceiver Receiver


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
    let
        a = Debug.log "handadd hand" hand
        b = Debug.log "handadd index" index
    in
    List.concat
        [
            List.take (index + 1) hand                           -- 0,1,2
            , cards |> List.map (\card -> (card, False))         -- 7
            , List.drop (index + 1) hand                         -- 3,4
        ]


handRemove: List ( DTOcard, Bool ) -> Int -> List ( DTOcard, Bool )
handRemove hand index =                            -- 0,1,2,3,4   2 => 0,1,3,4
    let
        a = Debug.log "handRemove hand" hand
        b = Debug.log "handRemove index" index
    in
    List.concat
        [
            List.take index hand                  -- 0,1
            , List.drop (index + 1) hand          -- 3,4
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
    case model.phase of
        Pending ->
            []

        _ ->
            DragDrop.draggable DragDropMsg ( Hand index )


droppableToHand: Model -> Int -> List (Attribute Msg)
droppableToHand model index =
    case ( model.phase, DragDrop.getDragId model.dragDrop ) of
        ( Pending, _ ) ->
            []

        ( DrawCard, _ ) ->
            DragDrop.droppable DragDropMsg ( Hand index )

        ( _, Just ( Hand indexFrom) ) ->
            DragDrop.droppable DragDropMsg ( Hand index )

        ( _, _ ) ->
            []


draggableFromBottom: Model -> List (Attribute Msg)
draggableFromBottom model =
    case model.phase of
        DrawCard ->
            DragDrop.draggable DragDropMsg BottomCard

        _ ->
            []


droppableToBottom: Model -> List (Attribute Msg)
droppableToBottom model =
    case model.phase of
        PutCard ->
            DragDrop.droppable DragDropMsg BottomCard

        _ ->
            []


draggableFromTop: Model -> List (Attribute Msg)
draggableFromTop model =
    case model.phase of
        DrawCard ->
            DragDrop.draggable DragDropMsg TopCard

        _ ->
            []


droppableToTop: Model -> List (Attribute Msg)
droppableToTop model =
    case model.phase of
        PutCard ->
            DragDrop.droppable DragDropMsg TopCard

        _ ->
            []

clickHand: Model -> Int -> List (Attribute Msg)
clickHand model index =
    case model.phase of
        PutCard ->
            [ onClick ( Select index ) ]

        _ ->
            []


droppableToTableSpace: Model -> Int -> List (Attribute Msg)
droppableToTableSpace model index =
    let
        a = Debug.log "droppableToTableSpace model.phase " model.phase
        b = Debug.log "droppableToTableSpace index " index
    in
        case ( model.phase, DragDrop.getDragId model.dragDrop ) of
            ( Pending, _ ) ->
                []

            ( PutCard, _ ) ->
                let
                    c = Debug.log "PutCard" "( DragDrop.droppable DragDropMsg ( Table index ) )"
                in
                    DragDrop.droppable DragDropMsg ( Table index )

            ( _, _ ) ->
                []


handRemoveSelected: List ( DTOcard, Bool ) -> List ( DTOcard, Bool )
handRemoveSelected dtoCardSelected =
    dtoCardSelected |> List.filter (\(dtoCard, selected) -> not selected )


tableAdd: List ( List DTOcard ) -> List DTOcard -> Int -> List ( List DTOcard )
tableAdd table cards index =
    let
        a = Debug.log "tableAdd cards" cards
        b = Debug.log "tableAdd index" index
    in
        Debug.log "tableADd result"
        (
            List.concat
            [
                List.take (index + 1) table                           -- 0,1,2
                , [ cards ]
                , List.drop (index + 1) table                         -- 3,4
            ]
        )


