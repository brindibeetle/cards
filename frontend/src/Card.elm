module Card exposing (..)

import Array
import Html exposing (..)
import Html.Attributes exposing (..)


type alias Card = { suit : Suit, rank : Rank }


type Rank = Ace | King | Queen | Jack | N10 | N9 | N8 | N7 | N6 | N5 | N4 | N3 | N2

type Suit = Spades | Hearts | Clubs | Diamonds

type Color = Black | Red | DarkBrown | LightBrown | Whitish | LightBlue | DarkBlue


allSuits : List Suit
allSuits = [ Spades, Hearts, Clubs, Diamonds ]


allRanks : List Rank
allRanks = [ Ace, King, Queen, Jack, N10, N9, N8, N7, N6, N5, N4, N3, N2 ]
--allRanks = [ N4, N3, N2, Ace]

allCards : List Card
allCards =
    List.foldl addCardsofSuit [] allSuits


addCardsofSuit : Suit -> List Card -> List Card
addCardsofSuit suit cards =
    List.map (thisCard suit) allRanks
    |> List.append cards


thisCard : Suit -> Rank -> Card
thisCard suit rank = { suit = suit , rank = rank }


getSuit : Card -> Suit
getSuit { suit } = suit


getRank : Card -> Int
getRank { rank } =
    case rank of
        Ace ->
            0
        N2 ->
            1
        N3 ->
            2
        N4 ->
            3
        N5 ->
            4
        N6 ->
            5
        N7 ->
            6
        N8 ->
            7
        N9 ->
            8
        N10 ->
            9
        Jack ->
            10
        Queen ->
            11
        King ->
            12


getChars : Card -> List (Int, Color)
getChars { suit, rank } =
    let
        ( suitOffset, suitColor ) =
            ( case suit of
                Clubs ->
                    ( 33, Black )
                Diamonds ->
                    ( 57, Red )
                Hearts ->
                    ( 81, Red )
                Spades ->
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
                Ace ->
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
                Jack ->
                    [ ( suitOffset + 10, Black )
                    , ( suitOffset + 11, DarkBrown )
                    , ( suitOffset + 12, LightBrown )
                    , ( suitOffset + 13, Red )
                    ]
                Queen ->
                    [ ( suitOffset + 14, Black )
                    , ( suitOffset + 15, DarkBrown )
                    , ( suitOffset + 16, LightBrown )
                    , ( suitOffset + 17, Red )
                    ]
                King ->
                    [ ( suitOffset + 18, Black )
                    , ( suitOffset + 19, DarkBrown )
                    , ( suitOffset + 20, LightBrown )
                    , ( suitOffset + 21, Red )
                    ]
            )
        ]


getColor : Card -> Color
getColor { suit } =
    case suit of
        Hearts ->
            Red
        Diamonds ->
            Red
        Clubs ->
            Black
        Spades ->
            Black


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


getCardFromNumber : Int -> Maybe Card
getCardFromNumber int =
    case ( getRankFromNumber ( modBy 13 int ) , getSuitFromNumber ( int // 13 ) ) of
        ( Just rank, Just suit ) ->
            Just { rank = rank, suit = suit }

        ( Nothing, _ ) ->
            Nothing

        ( _, Nothing ) ->
            Nothing


getRankFromNumber : Int -> Maybe Rank
getRankFromNumber int =
    allRanks
    |> Array.fromList
    |> Array.get int


getSuitFromNumber : Int -> Maybe Suit
getSuitFromNumber int =
    allSuits
    |> Array.fromList
    |> Array.get int

defaultCard : Card
defaultCard = { suit = Diamonds, rank = N2 }

-- ####
-- ####    VIEW
-- ####

animate : Card -> Html msg
animate card =
    div [ class "char-holder" ]
        ( List.map animateChar ( getChars card ) )


animateChar : ( Int, Color ) -> Html msg
animateChar ( int, color ) =
    div [ class "char ", getColorClass color "-animate" ]
    --[ text ( String.fromChar (Char.fromCode 130)) ]
    [ text ( String.fromChar (Char.fromCode int)) ]
    --[ text ( "\u{0082}") ]


view : Card -> Html msg
view card =
    div [ class "char-holder" ]
        ( List.map viewChar ( getChars card ) )


viewChar : ( Int, Color ) -> Html msg
viewChar ( int, color ) =
    div [ class "char ", getColorClass color "" ]
    --[ text ( String.fromChar (Char.fromCode 130)) ]
    [ text ( String.fromChar (Char.fromCode int)) ]
    --[ text ( "\u{0082}") ]


getCharsBack : List ( Int, Color )
getCharsBack =
    [ ( 161, Whitish )
    , ( 162, Black )
    , ( 165, DarkBlue )
    , ( 166, LightBlue )
    ]

viewBack : Html msg
viewBack =
    div [ class "char-holder" ]
        ( List.map viewChar ( getCharsBack ) )


cardPlaceholder : Html msg
cardPlaceholder =
    div [ class "card card-placeholder" ] [ viewBack ]


-- ####
-- ####    HELPER
-- ####


cardsSuccessivePile : Maybe Card -> Card -> Bool
cardsSuccessivePile maybeCard nextCard =
    case maybeCard of
        Nothing ->
            True
        Just card ->
            getColor card /= getColor nextCard
            &&
            getRank card == getRank nextCard + 1


cardsSuccessiveHome : Maybe Card -> Card -> Bool
cardsSuccessiveHome maybeCard nextCard =
    case maybeCard of
        Nothing ->
            getRank nextCard == 0
        Just card ->
            getSuit card == getSuit nextCard
            &&
            getRank card + 1 == getRank nextCard


