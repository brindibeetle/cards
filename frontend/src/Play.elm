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
        , dragDrop : DragDrop.Model DragId DropId
        , phase : Phase
    }


type Phase =
    Waiting
    | Pending       -- awaiting some interaction with server
    | DrawCard
    | PutCard


type DragId =
    DragTopCard
    | DragBottomCard
    | DragHand Int
    | DragTable Int

type DropId =
    DropBottomCard
    | DropHand Int
    | DropTable Int


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
            , playSend (dtoPlayEncoder dtoPlay )
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
            , div ( class "table-container" :: droppableToTableSpace model ( List.length table + 1 ) )
                ( List.indexedMap (viewTableSpace model) table )
            , div [ class "hand-container" ]
                ( List.indexedMap (viewHand model) hand )
            ]


viewHand : Model -> Int -> ( DTOcard, Bool ) -> Html Msg
viewHand model index dtoCardSelected =
    if Tuple.second dtoCardSelected then
        ( showSelectedCards model index ( Tuple.first dtoCardSelected ) )
    else
        div
            ( List.concat
                [ ( draggableFromHand model index )
                , ( droppableToHand model index )
                , ( clickHand model index )
                ]
            )
            [ div
                [ class "hand-card" ]
                [ DTOcard.view ( Tuple.first dtoCardSelected ) ]
            ]

viewTableSpace : Model -> Int -> List DTOcard -> Html Msg
viewTableSpace model index cards =
    div ( List.append
            ( droppableToTableSpace model index )
            [ class "table-space"]
        )
        ( List.indexedMap (viewTableSpaceCard model) cards )


viewTableSpaceCard : Model -> Int -> DTOcard -> Html Msg
viewTableSpaceCard model index card =
    div
        [ class "table-space-card"]
        [ DTOcard.view card ]


showSelectedCards : Model -> Int -> DTOcard -> Html Msg
showSelectedCards model index card =
    let
        maybeFrom = DragDrop.getDragId model.dragDrop
        isMeld = handSelected model.hand True
                        |> List.map Tuple.first
                        |> DTOcard.isMeld
    in
        div
            ( List.concat
                [ if isMeld then ( draggableFromHand model index ) else []
                , ( clickHand model index )
                , [ case maybeFrom of
                        Just ( DragHand i ) ->
                            class "hand-card hand-card-selected hand-card-selected-hide"
                        _ ->
                            class "hand-card hand-card-selected"
                  ]
                ]
            )
            [ DTOcard.view card ]

showDraggingCard : DTOcard -> Html Msg
showDraggingCard card =
    div
        [ class "hand-card-dragging" ]
        [ DTOcard.view card ]
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
    | DragDropMsg (DragDrop.Msg DragId DropId)
    | Select Int


update : Msg -> Model -> Session -> { model : Model, session : Session, cmd : Cmd Msg }
update msg model session =
    case msg of
        Receiver encoded ->
            let
                 { action, cards, topCardBack, bottomCard, numberOfCards } = dtoPlayDecodeValue encoded
            in
                case action of
                    TABLE ->
                        { model =
                            { model
                            | hand = handSelected model.hand False
                            , table =
                                case cards of
                                    [] ->
                                        model.table
                                    _ ->
                                        tableAdd model.table cards ( Debug.log "update TABLE numberofcards" numberOfCards )
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
                        Just ( DragBottomCard, DropHand index, _ ) ->
                            let
                                dtoPlay = DTOplay.makeGet session index
                            in
                            (
                                { model
                                | dragDrop = dragDropModel
                                , phase = Pending
                                }
                                , playSend (dtoPlayEncoder dtoPlay )
                            )
                        Just ( DragTopCard, DropHand index, _ ) ->
                            let
                                dtoPlay = DTOplay.makeDraw session index
                            in
                            (
                                { model
                                | dragDrop = dragDropModel
                                , phase = Pending
                                }
                                , playSend ( dtoPlayEncoder dtoPlay )
                            )
                        Just ( DragHand index, DropBottomCard, _ ) ->
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
                                        , playSend ( dtoPlayEncoder dtoPlay )
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

                        Just ( DragHand from, DropTable to, _ ) ->
                            if getHandSelect model from then
                                let
                                    dtoPlay = DTOplay.makeTable session model.hand ( Debug.log "Just ( DragHand from, DropTable to, _ ) to " to )
                                in
                                (
                                    { model
                                    | dragDrop = dragDropModel
                                    , phase = Pending
                                    }
                                    , playSend ( dtoPlayEncoder dtoPlay )
                                )
                            else
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
    List.concat
        [
            List.take (index + 1) hand                           -- 0,1,2
            , cards |> List.map (\card -> (card, False))         -- 7
            , List.drop (index + 1) hand                         -- 3,4
        ]


handRemove: List ( DTOcard, Bool ) -> Int -> List ( DTOcard, Bool )
handRemove hand index =                            -- 0,1,2,3,4   2 => 0,1,3,4
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
            DragDrop.draggable DragDropMsg ( DragHand index )


droppableToHand: Model -> Int -> List (Attribute Msg)
droppableToHand model index =
    case ( model.phase, DragDrop.getDragId model.dragDrop ) of
        ( Pending, _ ) ->
            []

        ( DrawCard, _ ) ->
            DragDrop.droppable DragDropMsg ( DropHand index )

        ( _, Just ( DragHand indexFrom) ) ->
            DragDrop.droppable DragDropMsg ( DropHand index )

        ( _, _ ) ->
            []


draggableFromBottom: Model -> List (Attribute Msg)
draggableFromBottom model =
    case model.phase of
        DrawCard ->
            DragDrop.draggable DragDropMsg DragBottomCard

        _ ->
            []


droppableToBottom: Model -> List (Attribute Msg)
droppableToBottom model =
    case model.phase of
        PutCard ->
            DragDrop.droppable DragDropMsg DropBottomCard

        _ ->
            []


draggableFromTop: Model -> List (Attribute Msg)
draggableFromTop model =
    case model.phase of
        DrawCard ->
            DragDrop.draggable DragDropMsg DragTopCard

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
    case ( model.phase, DragDrop.getDragId model.dragDrop ) of
        ( Pending, _ ) ->
            []

        ( PutCard, _ ) ->
            DragDrop.droppable DragDropMsg ( DropTable index )

        ( _, _ ) ->
            []


handSelected: List ( DTOcard, Bool ) -> Bool -> List ( DTOcard, Bool )
handSelected dtoCardSelected selectFilter =
    dtoCardSelected |> List.filter (\(dtoCard, selected) -> selectFilter == selected )




tableAdd: List ( List DTOcard ) -> List DTOcard -> Int -> List ( List DTOcard )
tableAdd table cards index =
    List.concat
    [
        List.take (index + 1) table                           -- 0,1,2
        , [ cards ]
        , List.drop (index + 1) table                         -- 3,4
    ]


