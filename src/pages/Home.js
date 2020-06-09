import "@codetrix-studio/capacitor-google-auth";
import "./Login.css";

import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { LobbyService } from "../services/LobbyService";
import Menu from "../components/Menu/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import { PlayService } from "../services/PlayService";
import { UserService } from "../services/UserSerivce";
import { menuController } from "@ionic/core";

const INITIAL_STATE = {
  loggedIn: true,
  user: {},
};

export default function Home(props) {
  const [state, setState] = useState({ ...INITIAL_STATE });

  useEffect(() => {
    UserService.getCurrentPlayer() &&
      PlayService.checkActiveGame().then((activeGame) => {
        if (activeGame) {
          PlayService.setActiveGame(activeGame);
          LobbyService.setLobby(activeGame);
          props.history.replace("/play", activeGame);
        } else {
          PlayService.setActiveGame();
          LobbyService.setLobby();
          setState({ ...state, noActiveGame: true });
        }
      });
  }, []);

  return (
    <>
      <Menu {...props} />
      <IonPage id="main">
        {state.noActiveGame && (
          <>
            <IonHeader>
              <IonToolbar color="primary">
                <IonButtons>
                  <IonMenuButton color="light">
                    <MenuIcon onClick={() => menuController.open()} />
                  </IonMenuButton>
                </IonButtons>
              </IonToolbar>
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
                    props.history.push({
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
                    props.history.push({
                      pathname: "/game",
                      state: "t ",
                    });
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
                    props.history.push({
                      pathname: "/myGames",
                      state: "t ",
                    });
                  }}
                >
                  My Hunts!
                </IonButton>
              </IonList>
            </IonContent>
          </>
        )}
      </IonPage>
    </>
  );
}
