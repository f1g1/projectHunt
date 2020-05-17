import "@codetrix-studio/capacitor-google-auth";
import "./Login.css";

import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import React, { Component } from "react";

import { LobbyService } from "../services/LobbyService";
import { PlayService } from "../services/PlayService";
import { Plugins } from "@capacitor/core";
import { UserService } from "../services/UserSerivce";

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
    const { history } = this.props;
    if (PlayService.getActiveGame()) {
      debugger;
      LobbyService.setLobby(PlayService.getActiveGame());
      history.replace("/play", PlayService.getActiveGame());
    } else {
      this.setState({ ...this.state, noActiveGame: true });
    }
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
        {this.state.noActiveGame && (
          <>
            <IonHeader>
              <IonToolbar color="primary"></IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonRow>
                <IonCol className="text-center">
                  <img
                    style={{ width: "200px", height: "200px" }}
                    src={require("../resources/logo.png")}
                  />
                </IonCol>
              </IonRow>

              <IonList style={{ marginTop: "10vh" }}>
                <IonButton
                  style={{
                    minHeight: "100px",
                    marginBottom: "30px",
                    fontWeight: "bold",
                    fontSize: "2.5em",
                    mode: "ios",
                  }}
                  expand="full"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.history.push({
                      pathname: "/lobbysearch",
                      state: "t ",
                    });
                  }}
                >
                  Play!
                </IonButton>
                <IonButton
                  expand="full"
                  style={{
                    minHeight: "50px",
                    marginBottom: "15px",
                    fontWeight: "bold",
                    fontSize: "1.5em",
                    mode: "ios",
                  }}
                  color="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.history.push({ pathname: "/game", state: "t " });
                  }}
                >
                  New hunt!
                </IonButton>
                <IonButton
                  style={{
                    minHeight: "50px",
                    marginBottom: "15px",
                    fontWeight: "bold",
                    fontSize: "1.5em",
                    mode: "ios",
                  }}
                  expand="full"
                  color="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.history.push({
                      pathname: "/myGames",
                      state: "t ",
                    });
                  }}
                >
                  My Hunts!
                </IonButton>

                <IonButton
                  style={{
                    minHeight: "50px",
                    marginTop: "30px",
                    fontWeight: "bold",
                    fontSize: "1.5em",
                    mode: "ios",
                  }}
                  className="login-button"
                  onClick={() => this.signOut()}
                  expand="full"
                  fill="solid"
                  color="danger"
                >
                  Logout!
                </IonButton>
              </IonList>
            </IonContent>
          </>
        )}
      </IonPage>
    );
  }
}

export default Home;
