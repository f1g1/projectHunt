import "./Play.scss";

import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonModal,
  IonPage,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import ClueList from "./ClueList";
import Dashboard from "../GameDashobard/Dashboard";
import { DashboardService } from "../../services/DashboardService";
import GameMap from "./GameMap/GameMap";
import LeaderBoard from "./LeaderBoard";
import { LobbyService } from "../../services/LobbyService";
import MiscService from "../../services/MiscService";
import { PlayService } from "../../services/PlayService";
import useGameChanges from "../../services/CustomHooks/useGameChanges";
import useTeamChanges from "../../services/CustomHooks/useTeamChanges";

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function Play(props) {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [geolocation, setGeolocation] = useState({ latitude: 0, longitude: 0 });
  const [game, setGame] = useState();
  const [showToast1, setShowToast1] = useState();
  const [showAlert1, setShowAlert1] = useState(false);

  const teams = useTeamChanges();
  const gameChanging = useGameChanges();

  useEffect(() => {
    MiscService.getCachedGeolocation().then((x) => setGeolocation(x));
  }, []);

  useEffect(() => {
    if (game && gameChanging && !LobbyService.ImAdmin(game))
      if (!arraysEqual(game.area, gameChanging.area)) {
        setShowToast1("Caution, game area as been modified!");
      }
    PlayService.setGame(gameChanging || {});
    setGame(gameChanging);
    if (gameChanging && gameChanging.finishTime) {
      LobbyService.handleGameClosed(
        LobbyService.getCurrentLobby(),
        gameChanging,
        teams
      );
      props.history.replace("/finishedGame");
    }
  }, [gameChanging]);

  const closeGame = () => {
    DashboardService.closeGame(
      LobbyService.getCurrentLobby(),
      game,
      teams
    ).then((x) => {
      LobbyService.handleGameClosed(
        LobbyService.getCurrentLobby(),
        game,
        teams
      );
    });

    // UserService.setCurrentUser(
    //   UserService.getUserFirebase(UserService.getCurrentUser().email)
    // );
  };

  return (
    <IonPage>
      {game && (
        <>
          <IonHeader>
            <IonToolbar
              color={LobbyService.ImAdmin(game) ? "tertiary" : "primary"}
            >
              <h1
                style={{ display: "inline-block" }}
                className="ion-padding-horizontal"
              >
                {game.title}
              </h1>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {teams.length > 0 &&
              game !== {} &&
              game &&
              (!LobbyService.ImAdmin(game) ? (
                <ClueList game={game} teams={teams} />
              ) : (
                <Dashboard game={game} teams={teams} />
              ))}
          </IonContent>
          <IonFooter>
            <IonToolbar>
              <IonButtons>
                <IonButton onClick={() => setShowChatModal(true)}>
                  Chat
                </IonButton>
                <IonButton onClick={() => setShowLeaderBoardModal(true)}>
                  LeaderBoard
                </IonButton>
                <IonButton onClick={() => setShowMap(true)}>Map</IonButton>
                {LobbyService.ImAdmin(game) && (
                  <IonButton
                    color="danger"
                    slot="block"
                    onClick={() => setShowAlert1(true)}
                  >
                    Close Game!
                  </IonButton>
                )}
              </IonButtons>
            </IonToolbar>
          </IonFooter>
        </>
      )}

      <IonAlert
        isOpen={showAlert1}
        onDidDismiss={() => setShowAlert1(false)}
        header={"You are going to close the game!"}
        subHeader={""}
        message={
          "A game once closed can't be opened again, and all the scored and the leaderboard will remain like that, are you sure you want to proceed?"
        }
        buttons={[
          {
            text: "Cancel!",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "YES!",
            handler: () => {
              closeGame();
            },
          },
        ]}
      />
      <IonModal
        isOpen={showChatModal}
        onDidDismiss={() => setShowChatModal(false)}
      >
        <ChatBoard
          gameChatId={LobbyService.getCurrentLobby()}
          handleClose={() => setShowChatModal(false)}
        />
      </IonModal>
      <IonModal
        isOpen={showLeaderBoardModal}
        onDidDismiss={() => setShowLeaderBoardModal(false)}
      >
        <LeaderBoard
          handleClose={() => setShowLeaderBoardModal(false)}
          teams={teams}
          game={game}
        />
      </IonModal>
      <IonModal
        className="gameMap"
        isOpen={showMap}
        onDidDismiss={() => setShowMap(false)}
      >
        <GameMap
          handleClose={() => setShowMap(false)}
          geolocation={geolocation}
          teams={teams}
          game={game}
        />
      </IonModal>
      <IonToast
        isOpen={showToast1 !== undefined}
        onDidDismiss={() => setShowToast1()}
        message={showToast1}
        duration={2000}
        position="top"
        color="light"
        mode="ios"
      />
    </IonPage>
  );
}
