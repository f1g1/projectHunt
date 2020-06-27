import "./Play.scss";

import {
  IonAlert,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonLabel,
  IonModal,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import ChatIcon from "@material-ui/icons/Chat";
import CloseIcon from "@material-ui/icons/Close";
import ClueList from "./ClueList";
import Dashboard from "../GameDashobard/Dashboard";
import { DashboardService } from "../../services/DashboardService";
import GameMap from "./GameMap/GameMap";
import LeaderBoard from "./LeaderBoard";
import LobbyPlayers from "../Lobby/LobbyPlayers";
import { LobbyService } from "../../services/LobbyService";
import { LocalNotifications } from "@ionic-native/local-notifications";
import MapIcon from "@material-ui/icons/Map";
import MiscService from "../../services/MiscService";
import { Network } from "@ionic-native/network";
import NotificationHandler from "./NotificationHandler";
import PeopleIcon from "@material-ui/icons/People";
import { PlayService } from "../../services/PlayService";
import { UserService } from "../../services/UserSerivce";
import useGameChanges from "../../services/CustomHooks/useGameChanges";
import useMessageChanges from "../../services/CustomHooks/useMessageChanges";
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
  const [chatMessageType, setChatMessageType] = useState("all");
  const [openChat, setOpenChat] = useState(0);
  const [myTeam, setMyTeam] = useState();
  const teams = useTeamChanges();
  const [unread, setUnread] = useState();
  const gameChanging = useGameChanges();
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [offline, setoffline] = useState("");

  const messages = useMessageChanges(
    teams,
    LobbyService.getCurrentLobby(),
    gameChanging,
    openChat
  );

  useEffect(() => {});
  useEffect(() => {
    MiscService.getCachedGeolocation()
      .then((x) => {
        setGeolocation(x);
      })
      .catch(() => MiscService.setAvalaibleLocation(false));

    let disconnectSubscription = Network.onDisconnect().subscribe(() => {
      setoffline(true);
      console.log("network was disconnected :-(");
    });

    let connectSubscription = Network.onConnect().subscribe(() => {
      console.log("network connected!");
      setoffline(false);

      setTimeout(() => {
        if (Network.type === "wifi") {
        }
      }, 3000);
    });

    return () => {
      disconnectSubscription.unsubscribe();
      connectSubscription.unsubscribe();
    };
  }, []);

  const notify = (text) => {
    LocalNotifications.schedule({
      id: 1,
      text,
    });
    setShowToast1(text);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setUnread(messages.length - MiscService.getChatNr());
      if (
        messages[messages.length - 1].idFrom !==
        UserService.getCurrentPlayer().name
      )
        if (
          messages.length - MiscService.getChatNr() > 0 &&
          MiscService.getNotificationSettings().message
        ) {
          setShowToast1("New message received!");
          if (messages[messages.length - 1].idFrom === game.owner)
            notify("New admin message received!");
        }
    }
  }, [messages]);

  useEffect(() => {
    setMyTeam(
      LobbyService.getPlayerTeam(UserService.getCurrentPlayer().name, teams)
    );
    if (gameChanging && teams && openChat === 0) setOpenChat(1);
  }, [teams]);

  useEffect(() => {
    if (game && gameChanging && !LobbyService.ImAdmin(game))
      if (!arraysEqual(game.area, gameChanging.area)) {
        if (MiscService.getNotificationSettings().map) {
          setShowToast1("Map has been modified, check it out!");
          notify("Map has been modified, check it out!");
        }
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
    if (gameChanging && teams && openChat === 0) setOpenChat(1);
  }, [gameChanging]);

  const handleKick = (username) => {
    let team = LobbyService.getPlayerTeam(username, teams);
    LobbyService.kickLobby(username, team);
  };

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
  };

  const handleOpenChat = () => {
    setShowChatModal(true);
    setOpenChat(openChat + 1);
    MiscService.setChatNr(messages.length);
    setUnread(messages.length - MiscService.getChatNr());
  };

  return (
    <IonPage>
      {game && (
        <>
          <IonHeader>
            <IonToolbar color="primary">
              <h1
                style={{ display: "inline-block" }}
                className="ion-padding-horizontal"
              >
                {game.title}
                {offline && (
                  <IonLabel
                    color="danger"
                    style={{ display: "inline-block" }}
                    className="ion-padding-horizontal ion-text-center"
                  >
                    <p className="ion-text-center">Offline!</p>
                  </IonLabel>
                )}
              </h1>
              <IonButtons slot="end">
                {LobbyService.ImAdmin(game) && (
                  <IonButton
                    shape="round"
                    color="danger"
                    slot="block"
                    onClick={() => setShowAlert1(true)}
                  >
                    <CloseIcon />
                    End Game!
                  </IonButton>
                )}
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {teams.length > 0 &&
              game !== {} &&
              game &&
              (!LobbyService.ImAdmin(game) ? (
                <ClueList
                  game={game}
                  teams={teams}
                  myTeam={myTeam}
                  offline={offline}
                />
              ) : (
                <Dashboard game={game} teams={teams} />
              ))}
          </IonContent>
          <IonFooter>
            <IonToolbar>
              <IonButtons>
                <IonButton
                  shape="round"
                  shape="round"
                  onClick={() => setShowLeaderBoardModal(true)}
                >
                  <img
                    style={{ width: "auto", height: "100%" }}
                    src={require("../../resources/leaderboard.png")}
                  />
                  LeaderBoard
                </IonButton>
                <IonButton
                  shape="round"
                  shape="round"
                  shape="round"
                  onClick={() => setShowMap(true)}
                >
                  <MapIcon />
                  Map
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  shape="round"
                  shape="round"
                  onClick={() => setShowPlayersModal(true)}
                >
                  <PeopleIcon />
                  Players
                </IonButton>
                <IonButton
                  shape="round"
                  onClick={() => {
                    handleOpenChat();
                  }}
                >
                  <ChatIcon />
                  Chat{" "}
                  {unread > 0 && (
                    <IonBadge color="danger" style={{ marginLeft: "10px" }}>
                      ({unread}){" "}
                    </IonBadge>
                  )}
                </IonButton>
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
        onDidDismiss={() => {
          setShowChatModal(false);
          setOpenChat(openChat - 10);
          setIsLoadingMessages(true);
        }}
        onDidPresent={() => {
          setOpenChat(openChat + 10);
          setIsLoadingMessages(false);
        }}
      >
        {messages && (
          <ChatBoard
            listMessage={messages}
            started
            teams={teams}
            gameChatId={LobbyService.getCurrentLobby()}
            handleClose={() => setShowChatModal(false)}
            lobby={game}
            chatMessageType={chatMessageType}
            setChatMessageType={setChatMessageType}
            muted={
              game &&
              game.muted &&
              game.muted.includes(UserService.getCurrentPlayer().name)
            }
            isLoadingMessages={isLoadingMessages}
            setUnread={setUnread}
            openChat={openChat}
          />
        )}
      </IonModal>
      <IonModal
        isOpen={showPlayersModal}
        onDidDismiss={() => setShowPlayersModal(false)}
      >
        <LobbyPlayers
          game={gameChanging}
          handleClose={() => setShowPlayersModal(false)}
          handleKick={handleKick}
          play={true}
          teams={teams}
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
          offline={offline}
        />
      </IonModal>
      {
        <NotificationHandler
          showToast1={showToast1}
          setShowToast1={setShowToast1}
        />
      }
    </IonPage>
  );
}
