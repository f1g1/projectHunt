import "./Lobby.scss";

import {
  IonAlert,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import JoinQrModal from "./JoinQrModal";
import LobbyPlayers from "./LobbyPlayers";
import { LobbyService } from "../../services/LobbyService";
import MapWithLocation from "../../components/Map/Map";
import MiscService from "../../services/MiscService";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import TeamsContainer from "./TeamsContainer";
import { UserService } from "../../services/UserSerivce";
import useGameChanges from "../../services/CustomHooks/useGameChanges";
import useMessageChanges from "../../services/CustomHooks/useMessageChanges";
import useTeamChanges from "../../services/CustomHooks/useTeamChanges";

export default function Lobby(props) {
  const lobbyChanging = useGameChanges(LobbyService.getCurrentLobby());
  const teams = useTeamChanges(props.location.lobbyId);
  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);
  const [openChat, setOpenChat] = useState(0);
  const [usernameToBan, setUsernameToBan] = useState();
  const [unread, setUnread] = useState();
  const [showQrJoinModal, setShowQrJoinModal] = useState();
  const [isLoadingMessages, setIsLoadingMessages] = useState();

  const messages = useMessageChanges(
    teams,
    LobbyService.getCurrentLobby(),
    lobbyChanging,
    1
  );
  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter((x) => x.name === name)[0]);
  };

  useEffect(() => {
    lobbyChanging && teams && setOpenChat(openChat + 1);
  }, [lobbyChanging, teams]);

  useEffect(() => {
    MiscService.setChatNr(0);
    return () => {
      if (lobbyChanging && lobbyChanging.startTime) {
        console.log("if (lobbyChanging && lobbyChanging.startTime");
        leaveLobby();
      }
    };
  }, []);

  useEffect(() => {
    console.log("messages", messages, "unread", MiscService.getChatNr());
    if (messages.length > 0) {
      setUnread(messages.length - MiscService.getChatNr());
    }
    isLoadingMessages === undefined && setIsLoadingMessages(true);
    isLoadingMessages === true && setIsLoadingMessages(false);
  }, [messages]);

  useEffect(() => {
    let ImInLobby =
      lobbyChanging &&
      lobbyChanging.players.includes(UserService.getCurrentPlayer().name);

    if (lobbyChanging && !ImInLobby) {
      props.history.go(-1);
      LobbyService.setLobby();
    }
    passGameStarted(lobbyChanging);
  }, [lobbyChanging]);

  const passGameStarted = (lobbyChanging) => {
    if (lobbyChanging && lobbyChanging.startTime)
      if (
        LobbyService.getPlayerTeam(
          UserService.getCurrentPlayer().name,
          teams
        ) ||
        LobbyService.ImAdmin(lobbyChanging)
      )
        props.history.replace("/play");
      else {
        leaveLobby();
      }
  };

  const handleKick = (username) => {
    let team = LobbyService.getPlayerTeam(username, teams);
    LobbyService.kickLobby(username, team);
  };

  const proceedBan = () => {
    console.log("banned!!!@!#!@");
    let team = LobbyService.getPlayerTeam(usernameToBan, teams);
    LobbyService.kickLobby(usernameToBan, team)
      .then(
        LobbyService.banPlayer(usernameToBan, LobbyService.getCurrentLobby())
      )
      .then(setUsernameToBan());
  };

  let startGame = () => {
    LobbyService.startGame(LobbyService.getCurrentLobby(), lobbyChanging);
  };
  const leaveLobby = () => {
    if (
      LobbyService.getPlayerTeam(UserService.getCurrentPlayer().name, teams)
    ) {
      leaveTeam(
        LobbyService.getCurrentLobby(),
        UserService.getCurrentPlayer.name,
        LobbyService.getPlayerTeam(UserService.getCurrentPlayer().name, teams)
      );
    }
    LobbyService.leaveLobby(
      UserService.getCurrentPlayer().name,
      teams,
      LobbyService.ImAdmin(lobbyChanging),
      lobbyChanging
    );
  };
  const joinTeam = (team) => {
    LobbyService.playerJoinTeam(
      LobbyService.getCurrentLobby(),
      team,
      UserService.getCurrentPlayer().name
    );
  };
  const leaveTeam = (lobbyId, player, team) => {
    LobbyService.leaveTeam(lobbyId, team.name, player, team.players.length);
  };

  return (
    <IonPage>
      {lobbyChanging ? (
        <>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Lobby for: </IonTitle>
              <IonTitle color="danger">{lobbyChanging.title}</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  color="danger"
                  onClick={() => {
                    console.log("clicked");
                    leaveLobby();
                  }}
                >
                  Leave
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
              <IonRow fixed>
                <IonCol
                  sizeLg="4"
                  sizeXl="3"
                  sizeMd="5"
                  sizeXs="12"
                  offsetXl="1.5"
                >
                  {lobbyChanging.image && (
                    <IonCard>
                      <IonCardContent>
                        <IonImg
                          src={lobbyChanging.image}
                          imageViewer
                          onClick={() => PhotoViewer.show(lobbyChanging.image)}
                        ></IonImg>
                      </IonCardContent>
                    </IonCard>
                  )}
                  <IonCard>
                    <IonCardContent>
                      <IonList>
                        <IonLabel>Description:</IonLabel>
                        <IonItem text-wrap break-word>
                          {lobbyChanging.description}
                        </IonItem>
                        Nr. of Challenges
                        <IonItem>
                          <IonLabel>
                            {lobbyChanging.steps
                              ? lobbyChanging.steps.length
                              : 0}
                          </IonLabel>
                        </IonItem>
                        Start Location
                        <div style={{ height: "300px" }}>
                          {lobbyChanging.startLat && (
                            <MapWithLocation
                              coords={{
                                lat: lobbyChanging.startLat,
                                lng: lobbyChanging.startLng,
                              }}
                            ></MapWithLocation>
                          )}
                        </div>
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
                  <TeamsContainer
                    teams={teams}
                    lobby={lobbyChanging}
                    max={lobbyChanging.maxPlayers}
                    showThisTeam={showThisTeam}
                    addPlayer
                    isAdmin={LobbyService.ImAdmin(lobbyChanging)}
                    joinedTeam={LobbyService.getPlayerTeam(
                      UserService.getCurrentPlayer().name,
                      teams
                    )}
                    currentTeamDetails={currentTeamDetails}
                    handleKick={handleKick}
                    leaveTeam={leaveTeam}
                    joinTeam={joinTeam}
                    handleBan={setUsernameToBan}
                  ></TeamsContainer>
                </IonCol>

                <IonCol sizeXl="30"></IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonFooter className="ion-no-border">
            <IonToolbar>
              <IonButtons>
                {LobbyService.ImAdmin(lobbyChanging) && (
                  <IonButton
                    color="primary"
                    onClick={() => setShowAlert1(true)}
                  >
                    Start Game
                  </IonButton>
                )}
                <IonButton
                  color="primary"
                  onClick={() => setShowQrJoinModal(true)}
                >
                  Show Join Qr
                </IonButton>

                <IonButton full onClick={() => setShowChatModal(true)}>
                  Chat
                  {unread > 0 && (
                    <IonBadge color="danger" style={{ marginLeft: "10px" }}>
                      ({unread}){" "}
                    </IonBadge>
                  )}
                </IonButton>
                <IonButton full onClick={() => setShowPlayersModal(true)}>
                  Players ({lobbyChanging.players.length})
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonFooter>
        </>
      ) : (
        <IonLoading
          isOpen={lobbyChanging}
          message={"Please wait..."}
          duration={5000}
        />
      )}
      <IonModal
        isOpen={showPlayersModal}
        onDidDismiss={() => setShowPlayersModal(false)}
      >
        <LobbyPlayers
          game={lobbyChanging}
          handleClose={() => setShowPlayersModal(false)}
          handleKick={handleKick}
          handleBan={setUsernameToBan}
          teams={teams}
        />
      </IonModal>
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
            setUnread={setUnread}
            listMessage={messages}
            teams={teams}
            gameChatId={LobbyService.getCurrentLobby()}
            handleClose={() => setShowChatModal(false)}
            lobby={lobbyChanging}
            muted={
              lobbyChanging &&
              lobbyChanging.muted &&
              lobbyChanging.muted.includes(UserService.getCurrentPlayer().name)
            }
            isLoadingMessages={isLoadingMessages}
          />
        )}
      </IonModal>
      {lobbyChanging && (
        <IonModal
          isOpen={showQrJoinModal}
          onDidDismiss={() => setShowQrJoinModal(false)}
        >
          <JoinQrModal
            handleClose={() => setShowQrJoinModal(false)}
            entryCode={lobbyChanging.password}
          />
        </IonModal>
      )}
      <IonAlert
        isOpen={usernameToBan !== undefined}
        onDidDismiss={() => setUsernameToBan()}
        header={"You are going to ban someone!"}
        subHeader={""}
        message={
          "A ban is permanent and irreversible, on this lobby, are you sure you want to proceed?"
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
              proceedBan();
            },
          },
        ]}
      />
      <IonAlert
        isOpen={showAlert1}
        onDidDismiss={() => setShowAlert1(false)}
        header={"You are going to start the game!"}
        subHeader={""}
        message={
          "Once a game starrts, players can't change teams, and new players can't join, are you sure you want to proceed?"
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
              startGame();
            },
          },
        ]}
      />
    </IonPage>
  );
}
