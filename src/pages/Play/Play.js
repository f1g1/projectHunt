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

export default function Play(props) {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [geolocation, setGeolocation] = useState({ latitude: 0, longitude: 0 });
  const [game, setGame] = useState();
  const [showAlert1, setShowAlert1] = useState(false);

  const teams = useTeamChanges();
  const gameChanging = useGameChanges();

  useEffect(() => {
    MiscService.getCachedGeolocation().then((x) => setGeolocation(x));
  }, []);

  useEffect(() => {
    debugger;
    PlayService.setGame(gameChanging || {});
    setGame(gameChanging);
  }, [gameChanging]);

  const closeGame = () => {
    DashboardService.closeGame(LobbyService.getCurrentLobby(), game);
  };

  return (
    <IonPage>
      {game && (
        <>
          <IonHeader>
            <IonToolbar
              color={LobbyService.ImAdmin(game) ? "tertiary" : "primary"}
            >
              {/* <IonButtons style={{ display: "inline-block" }}>
                <IonBackButton defaultHref="/home"></IonBackButton>
              </IonButtons> */}
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
                    onClick={setShowAlert1}
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
            text: "Ok!",
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
    </IonPage>
  );
}
