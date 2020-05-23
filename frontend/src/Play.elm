port module Play exposing (..)

import Array
import Domain.CardsRequest exposing (..)
import Domain.DTOcard as DTOcard exposing (Back(..), DTOcard, defaultDTOcard, meldSorter)
import Domain.DTOgame exposing (DTOgame)
import Domain.HandResponse exposing (TypeResponse(..), handResponseDecodeValue)
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
    | DragHandSelected
    | DragHand Int
    | DragTable Int

type DropId =
    DropBottomCard
    | DropHand Int
    | DropTable Int


-- refresh page :
init : Session -> ( Model, Cmd Msg )
init session =
    (
        { hand = []
        , table = []
        , topCardBack = DARK
        , bottomCard = defaultDTOcard
        , dragDrop = DragDrop.init
        , phase = DrawCard
        }
        , makeDealRequest session |> cardsRequestEncoder |> playSend
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
            , viewTable model

            , viewHand model
            ]


-- #####   VIEW TABLE


viewTable : Model -> Html Msg
viewTable model =
    let
        droppable = case DragDrop.getDragId model.dragDrop of
            Just DragHandSelected ->
                droppableToTableSpace model ( List.length model.table )
            _ ->
                []
    in
        div ( class "table-container" :: droppable )
            ( List.indexedMap (viewTableSpace model) model.table )


viewTableSpace : Model -> Int -> List DTOcard -> Html Msg
viewTableSpace model index cards =
    let
        droppable = case DragDrop.getDragId model.dragDrop of
            Just DragHandSelected ->
                droppableToTableSpace model index

            Just ( DragHand i ) ->
                case Array.fromList model.hand |> Array.get i |> Maybe.map Tuple.first of
                    Just card ->
                        if card :: cards |> DTOcard.isMeld then
                            droppableToTableSpace model index

                        else
                            []

                    Nothing ->
                        []

            _ ->
                []
    in
        div ( List.append
                droppable
                [ class "table-space"]
            )
            ( List.indexedMap (viewTableSpaceCard model) cards )


viewTableSpaceCard : Model -> Int -> DTOcard -> Html Msg
viewTableSpaceCard model index card =
    div
        [ class "table-space-card" ]
        [ DTOcard.view card ]


-- #####   VIEW HAND


viewHand : Model -> Html Msg
viewHand model =
    if handSelected model.hand True |> DTOcard.isMeld then
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
                 { bottomCard, topCardBack, typeResponse, place, cards, handPosition, tablePosition } = handResponseDecodeValue encoded
            in
                case ( typeResponse, place ) of
                    ( PutResponse, TABLE ) ->
                        { model =
                            { model
                            | hand = handSelected model.hand False |> List.map (\card -> ( card, False ) )
                            , table =
                                case cards of
                                    [] ->
                                        model.table
                                    _ ->
                                        tableAdd model.table cards ( Debug.log "update TABLE numberofcards" tablePosition )
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = PutCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    ( SlideResponse, TABLE ) ->
                        { model =
                            { model
                            | hand = removeFromHand handPosition model.hand
                            , table =
                                case cards of
                                    [] ->
                                        model.table
                                    _ ->
                                        tableMod model.table cards ( Debug.log "update TABLE tablePosition" tablePosition )
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = PutCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    ( DealResponse, _ ) ->
                        let
                            a = Debug.log "DealResponse cards=" cards
                        in
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

                    ( PutResponse, STACKBOTTOM ) ->
                        { model =
                            { model
                            | hand = handRemove model.hand handPosition
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = DrawCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    ( GetResponse, _ ) ->
                        { model =
                            { model
                            | hand = handAdd model.hand cards handPosition
                            , topCardBack = topCardBack
                            , bottomCard = bottomCard
                            , phase = PutCard
                            }
                        , session = session
                        , cmd = Cmd.none
                        }

                    ( _, _ ) ->
                        { model = model, session = session, cmd = Cmd.none }

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
                                , phase = Pending
                                }
                                , makeGetRequest session index STACKBOTTOM |> cardsRequestEncoder |> playSend
                            )
                        Just ( DragTopCard, DropHand index, _ ) ->
                            (
                                { model
                                | dragDrop = dragDropModel
                                , phase = Pending
                                }
                                , makeGetRequest session index STACKTOP |> cardsRequestEncoder |> playSend
                            )
                        Just ( DragHand index, DropBottomCard, _ ) ->
                            case getHandCard model index of
                                Just card ->
                                    (
                                        { model
                                        | dragDrop = dragDropModel

                                        , phase = Pending
                                        }
                                        , makePutRequest session [ card ] index 0 STACKBOTTOM |> cardsRequestEncoder |> playSend
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

                        Just ( DragHandSelected, DropTable to, _ ) ->
                            let
                                cards = Debug.log "DragHandSelected, DropTable " ( ( handSelected model.hand True ) |> meldSorter )
                            in
                            (
                                { model
                                | dragDrop = dragDropModel
                                , phase = Pending
                                }
                                , makePutRequest session cards 0 to TABLE |> cardsRequestEncoder |> playSend
                            )

                        Just ( DragHand i, DropTable to, _ ) ->
                            case Maybe.map2
                                (::)
                                ( Array.fromList model.hand |> Array.get i |> Maybe.map Tuple.first )
                                ( Array.fromList model.table |> Array.get to )
                            of
                                Just cards ->
                                    let
                                        a = Debug.log " DragHand i, DropTable to, cards=" cards
                                    in
                                    (
                                        { model
                                        | dragDrop = dragDropModel
                                        , hand = removeFromHand i model.hand
                                        , phase = Pending
                                        }
                                        , makeSlideRequest session (meldSorter cards) 0 to TABLE |> cardsRequestEncoder |> playSend
                                        --, playSend ( dtoPlayEncoder ( DTOplay.makeTableMod session cards to ) )
                                    )

                                Nothing ->
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
    case model.phase of
        Pending ->
            []

        _ ->
            DragDrop.draggable DragDropMsg ( DragHand index )


draggableFromHandSelected: Model -> List (Attribute Msg)
draggableFromHandSelected model =
    case model.phase of
        Pending ->
            []

        _ ->
            DragDrop.draggable DragDropMsg ( DragHandSelected )


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