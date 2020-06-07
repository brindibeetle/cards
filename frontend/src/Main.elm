module Main exposing (main)

import Browser exposing (Document, UrlRequest)
import Browser.Navigation as Nav
import CardsCDN
import Domain.SignupResponse as Signup
import Play
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
            Sub.batch
                [ Signup.subscriptions |> Sub.map SignupMsg
                , Play.subscriptions |> Sub.map PlayMsg
                ]

        Play playModel session ->
            Play.subscriptions |> Sub.map PlayMsg


type Model =
    Signup Signup.Model Session
    | Play Play.Model Session
    

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
            { title = "Jokeren, Aanmelden"
            , body = 
                [ CDN.stylesheet
                , CardsCDN.stylesheet
                , Signup.view model1 session |> Html.map SignupMsg
                ]
            }

        Play model1 session ->
            { title = "Jokeren, Spelen"
            , body =
                [ CDN.stylesheet
                , CardsCDN.stylesheet
                , Play.view model1 session |> Html.map PlayMsg
                ]
            }


toSession : Model -> Session
toSession model =
    case model of
        Signup _ session ->
            session

        Play _ session ->
            session


toModel :  Model -> Cmd Msg -> Session -> ( Model, Cmd Msg )
toModel model cmd session =
    case model of
        Signup signupModel session1 ->
            ( Signup signupModel session1, cmd )

        Play playModel session1 ->
            ( Play playModel session1, cmd )


-- #####
-- #####   UPDATE
-- #####


type Msg
    = SignupMsg Signup.Msg
    | PlayMsg Play.Msg
    | LinkClicked UrlRequest
    | UrlChanged Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        a = Debug.log "Main.update msg = " msg
        b = Debug.log "Main.update model = " model
    in
    case (msg, model) of

        --( SignupMsg Signup.DoStartGame, Signup signupModel session ) ->
        --   let
        --        ( updatedModel, updatedCmd ) = Play.init session
        --   in
        --        toModel (Play updatedModel session) (updatedCmd |> Cmd.map PlayMsg) session
        --

        ( SignupMsg subMsg, Signup signupModel session ) ->
           let
                updated = Signup.update subMsg signupModel session
           in
                toModel (Signup updated.model updated.session) (updated.cmd |> Cmd.map SignupMsg) updated.session

        ( PlayMsg subMsg, Signup signupModel session ) ->
            let
                playModel = Play.init session
                updated = Play.update subMsg playModel session
            in
                toModel (Play updated.model updated.session) (updated.cmd |> Cmd.map PlayMsg) updated.session

        ( PlayMsg subMsg, Play playModel session ) ->
           let
                updated = Play.update subMsg playModel session
           in
                toModel (Play updated.model updated.session) (updated.cmd |> Cmd.map PlayMsg) updated.session

        ( LinkClicked _, _ ) ->
            ( model, Cmd.none )

        ( UrlChanged _, _ ) ->
            ( model, Cmd.none )

        ( _, _ ) ->
            ( model, Cmd.none )


