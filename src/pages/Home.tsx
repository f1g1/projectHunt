import { Plugins } from "@capacitor/core";
import "@codetrix-studio/capacitor-google-auth";
import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { Component } from "react";
import { UserService } from "../services/UserSerivce";
import "./Login.css";

const INITIAL_STATE = {
  loggedIn: true,
  user: {},
};

class Home extends Component {
  state: any = {};
  props: any = {};
  constructor(props: any) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    // this.getUserInfo();
  }

  async signOut(): Promise<void> {
    const { history } = this.props;
    const { navigation } = this.props;
    await Plugins.GoogleAuth.signOut();
    history.replace("login");
    // navigation.navigate("login", { initial: "login" });

    UserService.logout();
  }

  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Logged in ... </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRow>
            <IonCol className="text-center">
              <IonText className="title">
                You are logged in {UserService.getCurrentPlayer().name}!
              </IonText>
            </IonCol>
          </IonRow>
          <IonButton
            className="login-button"
            onClick={() => this.signOut()}
            expand="full"
            fill="solid"
            color="danger"
          >
            Logout from Google
          </IonButton>
          <IonList>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({ pathname: "/game", state: "t" });
              }}
            >
              GO TO CREATE
            </IonButton>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({ pathname: "/test", state: "t " });
              }}
            >
              GO TO Test
            </IonButton>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({ pathname: "/chat", state: "t " });
              }}
            >
              GO TO chat
            </IonButton>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({ pathname: "/myGames", state: "t " });
              }}
            >
              GO TO my games
            </IonButton>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({ pathname: "/lobby", state: "t " });
              }}
            >
              GO TO Lobby
            </IonButton>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({
                  pathname: "/lobbysearch",
                  state: "t ",
                });
              }}
            >
              GO TO Lobby search
            </IonButton>
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({ pathname: "/Tab1", state: "t " });
              }}
            >
              QR
            </IonButton>

            <IonButton
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push({
                  pathname: "/gameDashboard",
                  state: "",
                });
              }}
            >
              Dashboard
            </IonButton>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

export default Home;
