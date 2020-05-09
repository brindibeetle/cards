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

type alias RegularCard = { suit : Suit, rank : Rank, back : Back }

type alias SpecialCard = { specialType : SpecialType, back : Back  }


defaultDTOcard : DTOcard
defaultDTOcard =
    Special { specialType = JOKER, back = DARK }


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
        |> Pipeline.required "suit" suitDecoder
        |> Pipeline.required "rank" rankDecoder
        |> Pipeline.required "back" backDecoder


dtoCardSpecialDecoder : Decoder SpecialCard
dtoCardSpecialDecoder =
    succeed SpecialCard
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
            let
                a = Debug.log "OK" payload
            in
                dtoGame

        Err message ->
            let
                a = Debug.log "Err" message
            in
                defaultDTOcard


-- ####
-- ####   ENCODER
-- ####


dtoCardEncoder : DTOcard -> Encode.Value
dtoCardEncoder dtoCard =
    case dtoCard of
        Regular { suit, rank, back } ->
            Encode.object
                [ ( "suit", suitEncoder suit )
                , ( "rank", rankEncoder rank )
                , ( "back", backEncoder back )
                ]

        Special { specialType, back } ->
            Encode.object
                [ ( "specialType", specialTypeEncoder specialType )
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


