module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Nav
import CardsCDN
import Url exposing (Url)
import Html exposing (..)
import Bootstrap.CDN as CDN

import Session exposing (..)
import Signup exposing (..)
import Domain.InitFlags exposing (..)

main : Program String Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Signup signupModel session ->
            Signup.subscriptions signupModel |> Sub.map SignupMsg


type Model =
    Signup Signup.Model Session
    

-- refresh page : 
init : String -> Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url navKey =
    let
        session = Session.initialSession (getInitFlags flags)
        ( model, cmd ) = Signup.init session
    in
        ( Signup model session, cmd |> Cmd.map SignupMsg)


-- #####
-- #####   VIEW
-- #####


view : Model -> Document Msg
view model =
    case model of
        Signup model1 session ->
            { title = "Jokeren"
            , body = 
                [ CDN.stylesheet
                , CardsCDN.stylesheet
                , Signup.view model1 |> Html.map SignupMsg
                ]
            }


toSession : Model -> Session
toSession model =
    case model of
        Signup _ session ->
            session


toModel :  Model -> Cmd Msg -> Session -> ( Model, Cmd Msg )
toModel model cmd session =
    case ( session.page, model ) of
        ( SignupPage, Signup signupModel session1 ) ->
            ( Signup signupModel session1, cmd )


-- #####
-- #####   UPDATE
-- #####


type Msg
    = SignupMsg Signup.Msg
    | LinkClicked UrlRequest
    | UrlChanged Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case (msg, model) of
        ( SignupMsg subMsg, Signup signupModel session ) ->
           let
                updated = Signup.update subMsg signupModel session
           in
                toModel (Signup updated.model session) (updated.cmd |> Cmd.map SignupMsg) updated.session

        ( LinkClicked _, _ ) ->
            ( model, Cmd.none )

        ( UrlChanged _, _ ) ->
            ( model, Cmd.none )


