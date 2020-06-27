module Domain.DTOcard exposing (..)

import Html exposing (Attribute, Html, div, text)
import Html.Attributes exposing (class)
import Json.Decode as Decode exposing (Decoder, decodeString, string, succeed)
import Json.Decode.Pipeline as Pipeline
import Json.Encode as Encode

type DTOcard =
    Regular RegularCard
    | Special SpecialCard

type Rank = ACE | KING | QUEEN | JACK | N10 | N9 | N8 | N7 | N6 | N5 | N4 | N3 | N2

type Suit = SPADES | HEARTS | CLUBS | DIAMONDS

type SpecialType = JOKER

type Back = DARK | LIGHT

type alias RegularCard = { uuid : String, suit : Suit, rank : Rank, back : Back }

type alias SpecialCard = { uuid : String, specialType : SpecialType, back : Back  }

defaultDTOcard : DTOcard
defaultDTOcard =
    Special { uuid = "", specialType = JOKER, back = DARK }


-- ####
-- ####   DECODER
-- ####


dtoCardDecoder : Decoder DTOcard
dtoCardDecoder =
    Decode.oneOf
    [ Decode.map Regular dtoCardRegularDecoder
    , Decode.map Special dtoCardSpecialDecoder
    ]


dtoCardRegularDecoder : Decoder RegularCard
dtoCardRegularDecoder =
    succeed RegularCard
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "suit" suitDecoder
        |> Pipeline.required "rank" rankDecoder
        |> Pipeline.required "back" backDecoder


dtoCardSpecialDecoder : Decoder SpecialCard
dtoCardSpecialDecoder =
    succeed SpecialCard
        |> Pipeline.required "uuid" Decode.string
        |> Pipeline.required "specialType" specialTypeDecoder
        |> Pipeline.required "back" backDecoder


specialTypeDecoder : Decoder SpecialType
specialTypeDecoder =
    Decode.string |> Decode.andThen specialTypeFromString


specialTypeFromString : String -> Decoder SpecialType
specialTypeFromString string =
    case string of
        "JOKER" -> Decode.succeed JOKER
        _ -> Decode.fail ( "Invalid specialType: " ++ string )


backDecoder : Decoder Back
backDecoder =
    Decode.string |> Decode.andThen backFromString


backFromString : String -> Decoder Back
backFromString string =
    case string of
        "DARK" -> Decode.succeed DARK
        "LIGHT" -> Decode.succeed LIGHT
        _ -> Decode.fail ( "Invalid back: " ++ string )


suitDecoder : Decoder Suit
suitDecoder =
    Decode.string |> Decode.andThen suitFromString


suitFromString : String -> Decoder Suit
suitFromString string =
    case string of
        "CLUBS" -> Decode.succeed CLUBS
        "DIAMONDS" -> Decode.succeed DIAMONDS
        "HEARTS" -> Decode.succeed HEARTS
        "SPADES" -> Decode.succeed SPADES
        _ -> Decode.fail ( "Invalid suit: " ++ string )


rankDecoder : Decoder Rank
rankDecoder =
    Decode.string |> Decode.andThen rankFromString


rankFromString : String -> Decoder Rank
rankFromString string =
    case string of
        "ACE" -> Decode.succeed ACE
        "KING" -> Decode.succeed KING
        "QUEEN" -> Decode.succeed QUEEN
        "JACK" -> Decode.succeed JACK
        "N10" -> Decode.succeed N10
        "N9" -> Decode.succeed N9
        "N8" -> Decode.succeed N8
        "N7" -> Decode.succeed N7
        "N6" -> Decode.succeed N6
        "N5" -> Decode.succeed N5
        "N4" -> Decode.succeed N4
        "N3" -> Decode.succeed N3
        "N2" -> Decode.succeed N2
        _ -> Decode.fail ( "Invalid rank: " ++ string )


decodeDTOcard : Encode.Value -> DTOcard
decodeDTOcard payload =
    case Decode.decodeValue dtoCardDecoder payload of
        Ok dtoGame ->
            dtoGame

        Err message ->
            defaultDTOcard


-- ####
-- ####   ENCODER
-- ####


dtoCardEncoder : DTOcard -> Encode.Value
dtoCardEncoder dtoCard =
    case dtoCard of
        Regular { uuid, suit, rank, back } ->
            Encode.object
                [ ( "uuid", Encode.string uuid )
                , ( "suit", suitEncoder suit )
                , ( "rank", rankEncoder rank )
                , ( "back", backEncoder back )
                ]

        Special { uuid, specialType, back } ->
            Encode.object
                [ ( "uuid", Encode.string uuid )
                , ( "specialType", specialTypeEncoder specialType )
                , ( "back", backEncoder back )
                ]


suitEncoder : Suit -> Encode.Value
suitEncoder suit =
    case suit of
        SPADES -> Encode.string "SPADES"
        HEARTS -> Encode.string "HEARTS"
        CLUBS -> Encode.string "CLUBS"
        DIAMONDS -> Encode.string "DIAMONDS"


rankEncoder : Rank -> Encode.Value
rankEncoder rank =
    case rank of
        ACE -> Encode.string "ACE"
        KING -> Encode.string "KING"
        QUEEN -> Encode.string "QUEEN"
        JACK -> Encode.string "JACK"
        N10 -> Encode.string "N10"
        N9 -> Encode.string "N9"
        N8 -> Encode.string "N8"
        N7 -> Encode.string "N7"
        N6 -> Encode.string "N6"
        N5 -> Encode.string "N5"
        N4 -> Encode.string "N4"
        N3 -> Encode.string "N3"
        N2 -> Encode.string "N2"


backEncoder : Back -> Encode.Value
backEncoder back =
    case back of
        DARK -> Encode.string "DARK"
        LIGHT -> Encode.string "LIGHT"


specialTypeEncoder : SpecialType -> Encode.Value
specialTypeEncoder specialType =
    case specialType of
        JOKER -> Encode.string "JOKER"


-- ####
-- ####   PAINT
-- ####

type Color = Black | Red | DarkBrown | LightBrown | Whitish | LightBlue | DarkBlue | Blue | Yellow


getColorClass : Color -> String -> Attribute msg
getColorClass color postString =
    case color of
        Black ->
            class ( "color-black" ++ postString )

        Red ->
            class ( "color-red" ++ postString )

        DarkBrown ->
            class ( "color-darkbrown" ++ postString )

        LightBrown ->
            class ( "color-lightbrown" ++ postString )

        Whitish ->
            class ( "color-whitish" ++ postString )

        LightBlue ->
            class ( "color-lightblue" ++ postString )

        DarkBlue ->
            class ( "color-darkblue" ++ postString )

        Blue ->
            class ( "color-blue" ++ postString )

        Yellow ->
            class ( "color-yellow" ++ postString )



getChars : DTOcard -> List (Int, Color)
getChars dtoCard =
    case dtoCard of
        Regular { suit, rank } ->
            let
                ( suitOffset, suitColor ) =
                    ( case suit of
                        CLUBS ->
                            ( 33, Black )
                        DIAMONDS ->
                            ( 57, Red )
                        HEARTS ->
                            ( 81, Red )
                        SPADES ->
                            ( 105, Black )
                    )
            in
                List.concat
                [
                    [ ( 161, Whitish )
                    , ( 162, Black )
                    ]
                    ,
                    ( case rank of
                        ACE ->
                            [ ( suitOffset + 0, suitColor ) ]
                        N2 ->
                            [ ( suitOffset + 1, suitColor ) ]
                        N3 ->
                            [ ( suitOffset + 2, suitColor ) ]
                        N4 ->
                            [ ( suitOffset + 3, suitColor ) ]
                        N5 ->
                            [ ( suitOffset + 4, suitColor ) ]
                        N6 ->
                            [ ( suitOffset + 5, suitColor ) ]
                        N7 ->
                            [ ( suitOffset + 6, suitColor ) ]
                        N8 ->
                            [ ( suitOffset + 7, suitColor ) ]
                        N9 ->
                            [ ( suitOffset + 8, suitColor ) ]
                        N10 ->
                            [ ( suitOffset + 9, suitColor ) ]
                        JACK ->
                            [ ( suitOffset + 10, Black )
                            , ( suitOffset + 11, DarkBrown )
                            , ( suitOffset + 12, LightBrown )
                            , ( suitOffset + 13, Red )
                            ]
                        QUEEN ->
                            [ ( suitOffset + 14, Black )
                            , ( suitOffset + 15, DarkBrown )
                            , ( suitOffset + 16, LightBrown )
                            , ( suitOffset + 17, Red )
                            ]
                        KING ->
                            [ ( suitOffset + 18, Black )
                            , ( suitOffset + 19, DarkBrown )
                            , ( suitOffset + 20, LightBrown )
                            , ( suitOffset + 21, Red )
                            ]
                    )
                ]
        Special { specialType } ->
            List.concat
            [
                [ ( 161, Whitish )
                , ( 162, Black )
                ]
                ,
                ( case specialType of
                    JOKER ->
                        let
                            offset = 169
                        in
                            [ ( offset, Black )
                            , ( offset + 1, Blue )
                            , ( offset + 2, Red )
                            , ( offset + 3, Yellow )
                            ]
                )
            ]


view : DTOcard -> Html msg
view dtoCard =
    div [ class "char-holder" ]
        ( List.map viewChar ( getChars dtoCard ) )


viewEmpty : Html msg
viewEmpty =
    div [ class "char-holder" ]
        []


viewChar : ( Int, Color ) -> Html msg
viewChar ( int, color ) =
    div [ class "char ", getColorClass color "" ]
    --[ text ( String.fromChar (Char.fromCode 130)) ]
    [ text ( String.fromChar (Char.fromCode int)) ]
    --[ text ( "\u{0082}") ]


getCharsBack : Back -> List ( Int, Color )
getCharsBack back =
    case back of
        DARK ->
            [ ( 161, Whitish )
            , ( 162, Black )
            , ( 165, DarkBlue )
            , ( 166, LightBlue )
            ]

        LIGHT ->
            [ ( 161, Whitish )
            , ( 162, Black )
            , ( 165, Red )
            , ( 166, LightBrown )
            ]


viewBack : Back -> Html msg
viewBack back =
    div [ class "char-holder" ]
        ( List.map viewChar ( getCharsBack back ) )


-- ####
-- ####   HELPER
-- ####


getUUID : DTOcard -> String
getUUID card =
    case card of
        Regular { uuid } ->
            uuid

        Special { uuid } ->
            uuid

getUUIDs : List DTOcard -> List String
getUUIDs cards =
    List.map getUUID cards

-- ####
-- ####   MELD sets of cards and runs of cards
-- ####


isMeld : List DTOcard -> Bool
isMeld cards =
    List.length cards >= 3
    &&
    (
        (
            ( cardsRegulars cards |> List.map .rank |> allOfOneKind )
            &&
            ( cardsRegulars cards |> List.map .suit |> allDifferent )
            &&
            List.length cards <= 4
        )
        ||
        (
            ( cardsRegulars cards |> List.map .suit |> allOfOneKind )
            &&
            ranksSuccessive
                ( cardsRegulars cards |> List.map .rank )
                ( cardsSpecials cards |> List.length )
            &&
            ( cardsRegulars cards |> List.map .rank |> allDifferent )
            &&
            List.length cards <= 13
            -- &&
            -- todo ACE always BEGIN or END of a run, never in between
        )
    )


cardsRegulars : List DTOcard -> List { uuid : String, suit : Suit, rank : Rank, back : Back }
cardsRegulars cards =
    List.filterMap cardRegular cards

cardRegular : DTOcard -> Maybe { uuid : String, suit : Suit, rank : Rank, back : Back }
cardRegular card =
    case card of
        Special _ -> Nothing
        Regular rcard -> Just rcard

cardsSpecials : List DTOcard -> List { uuid : String, specialType : SpecialType, back : Back }
cardsSpecials cards =
    List.filterMap cardSpecial cards

cardSpecial : DTOcard -> Maybe { uuid : String, specialType : SpecialType, back : Back }
cardSpecial card =
    case card of
        Special scard -> Just scard
        Regular _ -> Nothing


specialToCard : SpecialCard -> DTOcard
specialToCard scard =
    Special scard


regularToCard : RegularCard -> DTOcard
regularToCard rcard =
    Regular rcard


allOfOneKind : List a -> Bool
allOfOneKind lista =
    List.foldl allOfOneKindHelper ( True, Nothing ) lista
    |> Tuple.first


allOfOneKindHelper : a -> ( Bool, Maybe a ) -> ( Bool, Maybe a )
allOfOneKindHelper aa ( bool, maybeA ) =
    case maybeA of
        Nothing ->
            ( bool, Just aa )
        Just aa1 ->
            ( bool && aa1 == aa, Just aa )


allDifferent : List a -> Bool
allDifferent lista =
    List.foldl allDifferentHelper ( True, [] ) lista
    |> Tuple.first


allDifferentHelper : a -> ( Bool, List a ) -> ( Bool, List a )
allDifferentHelper a1 ( bool, lista ) =
    ( bool && not ( List.member a1 lista ), a1 :: lista )


ranksSuccessive : List Rank -> Int -> Bool
ranksSuccessive ranks jokers =
    let
        withoutAcesSorted = List.filter ( \rank  -> rank /= ACE ) ranks |>  List.sortBy ( numerizeRank )
        onlyAces = List.filter ( \rank -> rank == ACE ) ranks
        lowestRank = List.head withoutAcesSorted |> Maybe.map numerizeRank |> Maybe.withDefault 0
        highestRank = List.drop ( List.length withoutAcesSorted - 1) withoutAcesSorted |> List.head |> Maybe.map numerizeRank |> Maybe.withDefault 0
        ( lRank, hRank ) =
            case onlyAces of
                [] ->
                    ( lowestRank, highestRank )
                _::_ ->
                    if ( lowestRank - 2 ) > ( 13 - highestRank ) then
                        ( lowestRank, 14 )
                    else
                        ( 1, highestRank )
    in
        ( hRank - lRank + 1 ) <= List.length ranks + jokers


rankHasSuccessor : Rank -> ( List Rank, Int ) -> ( List Rank, Int )
rankHasSuccessor rank ( ranks, noSuccessor ) =
    ( ranks
    , noSuccessor +
        if List.member ( successor rank ) ranks then 0 else 1
    )


successor : Rank -> Rank
successor rank =
    case rank of
        ACE -> N2
        KING -> ACE
        QUEEN -> KING
        JACK -> QUEEN
        N10 -> JACK
        N9 ->  N10
        N8 ->  N9
        N7 ->  N8
        N6 ->  N7
        N5 ->  N6
        N4 ->  N5
        N3 ->  N4
        N2 ->  N3

numerizeRank : Rank -> Int
numerizeRank rank =
    case rank of
        ACE -> 1
        KING -> 13
        QUEEN -> 12
        JACK -> 11
        N10 -> 10
        N9 ->  9
        N8 ->  8
        N7 ->  7
        N6 ->  6
        N5 ->  5
        N4 ->  4
        N3 ->  3
        N2 ->  2

numerizeRankHighest : Rank -> Int
numerizeRankHighest rank =
    case rank of
        ACE -> 14
        _ -> numerizeRank rank

numerizeRankLowest : Rank -> Int
numerizeRankLowest rank =
    case rank of
        ACE -> 1
        _ -> numerizeRank rank


numerizeSuit : Suit -> Int
numerizeSuit suit =
    case suit of
        DIAMONDS -> 1
        CLUBS -> 2
        HEARTS -> 3
        SPADES -> 4


meldRunSorter : List RegularCard -> List RegularCard
meldRunSorter cards =
    -- aces in a run come either before 2 or after king
    let
        withoutAcesSorted = List.filter ( \{ rank } -> rank /= ACE ) cards |>  List.sortBy ( \rcard -> .rank rcard |> numerizeRank )
        onlyAces = List.filter ( \{ rank } -> rank == ACE ) cards
        lowestRank = List.head withoutAcesSorted
        highestRank = List.drop ( List.length withoutAcesSorted - 1) withoutAcesSorted |> List.head
    in
        case ( onlyAces, lowestRank, highestRank ) of
            ( [], _, _ ) ->
                withoutAcesSorted

            ( _, Nothing, _ ) ->
                withoutAcesSorted

            ( _, _, Nothing ) ->
                withoutAcesSorted

            ( ace::rest, Just lowest, Just highest ) ->
                if ( lowest.rank |> numerizeRank |> (+) -2 ) > ( highest.rank |> numerizeRank |> (-) 13 ) then
                    List.append withoutAcesSorted onlyAces
                else
                    List.append onlyAces withoutAcesSorted


meldSorted : List DTOcard -> Bool
meldSorted cards =
     if ( cardsRegulars cards |> List.map .rank |> allOfOneKind ) then
        True
     else
        meldRunSorted 0 Nothing cards


meldRunSorted : Int -> Maybe Int -> List DTOcard -> Bool
meldRunSorted numberOfWildCards lastRank cards =
    case cards of
        [] ->
            True

        card::rest ->
            case ( card, lastRank ) of
                ( Regular { rank }, Nothing ) ->
                    if numerizeRank rank <= numberOfWildCards then
                        False
                    else
                        meldRunSorted 0 (Just ( numerizeRank rank )) rest

                ( Special _, Nothing ) ->
                    meldRunSorted (numberOfWildCards + 1) Nothing rest

                ( Special _, Just lastRank1 ) ->
                    if lastRank1 + numberOfWildCards + 1 > 14 then
                        False
                    else
                        meldRunSorted (numberOfWildCards + 1) (Just lastRank1) rest

                ( Regular { rank }, Just lastRank1 ) ->
                    if lastRank1 + numberOfWildCards + 1 == numerizeRankHighest rank then
                        meldRunSorted 0 (Just (numerizeRankHighest rank)) rest
                    else
                        False


meldSorter : List DTOcard -> List DTOcard
meldSorter cards =
     if ( cardsRegulars cards |> List.map .rank |> allOfOneKind ) then
        cards
     else
        let
            rcards = cardsRegulars cards |> meldRunSorter
            scards = cardsSpecials cards
        in
            distributeJokersInSortedMeldRun [] rcards scards


distributeJokersInSortedMeldRun : List DTOcard -> List RegularCard -> List SpecialCard -> List DTOcard
distributeJokersInSortedMeldRun cards rCards sCards =
    case ( rCards, sCards ) of
        ( [], _ ) ->
            List.append cards ( sCards |> List.map specialToCard )

        ( _, [] ) ->
            List.append cards ( rCards |> List.map regularToCard )

        ( rCard::[], sCard::sCardsRest ) ->
            let
                highestCardsRank = rCard.rank |> numerizeRankHighest
                lowestCardsRank = highestCardsRank
                cardsToDistribute = ( List.length rCards ) + ( List.length sCards )
                numberOfPlacesLeft = 1
            in
                if cardsToDistribute > numberOfPlacesLeft && lowestCardsRank > List.length cards + 1 then
                    distributeJokersInSortedMeldRun
                        ( List.append cards [ specialToCard sCard ] )
                        rCards
                        sCardsRest
                else
                    distributeJokersInSortedMeldRun
                        ( List.append cards [ regularToCard rCard ] )
                        []
                        sCards

        ( rCard::rCardsRest, sCard::sCardsRest ) ->
            let
                highestCardsRank = List.drop ( List.length rCards - 1) rCards
                    |> List.head |> Maybe.map .rank |>  Maybe.map numerizeRankHighest |> Maybe.withDefault 14
                lowestCardsRank = rCard.rank |>  numerizeRankLowest
                cardsToDistribute = ( List.length rCards ) + ( List.length sCards )
                numberOfPlacesLeft = highestCardsRank - numerizeRank rCard.rank + 1 |> max 0
            in
                if cardsToDistribute > numberOfPlacesLeft && lowestCardsRank > List.length cards + 1 then
                    distributeJokersInSortedMeldRun
                        ( List.append cards [ specialToCard sCard ] )
                        rCards
                        sCardsRest
                else
                    distributeJokersInSortedMeldRun
                        ( List.append cards [ regularToCard rCard ] )
                        rCardsRest
                        sCards


cardSorter : DTOcard -> DTOcard -> Order
cardSorter card1 card2 =
    case ( card1, card2 ) of
        ( Special _, Special _ ) -> EQ
        ( Special _, _ ) -> LT
        ( _, Special _ ) -> GT
        ( Regular rCard1, Regular rCard2 ) ->
            case ( suitSorter rCard1.suit rCard2.suit ) of
                EQ -> rankSorter rCard1.rank rCard2.rank
                sort -> sort


suitSorter : Suit -> Suit -> Order
suitSorter suit1 suit2 =
    compare (numerizeSuit suit1) (numerizeSuit suit2)


rankSorter : Rank -> Rank -> Order
rankSorter rank1 rank2 =
    compare (numerizeRank rank1) (numerizeRank rank2)

