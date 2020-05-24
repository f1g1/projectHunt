import "./Lobby.scss";

import {
  IonAlert,
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
import LobbyPlayers from "./LobbyPlayers";
import { LobbyService } from "../../services/LobbyService";
import MapWithLocation from "../../components/Map/Map";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import TeamsContainer from "./TeamsContainer";
import { UserService } from "../../services/UserSerivce";
import useGameChanges from "../../services/CustomHooks/useGameChanges";
import useMessageChanges from "../../services/CustomHooks/useMessageChanges";
import useTeamChanges from "../../services/CustomHooks/useTeamChanges";

export default function Lobby(props) {
  const lobbyChanging = useGameChanges(LobbyService.getCurrentLobby());
  const [lobby, setLobby] = useState();
  const [joinedTeam, setJoinedTeam] = useState();
  const teams = useTeamChanges(props.location.lobbyId);
  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);
  const [openChat, setOpenChat] = useState(0);
  const messages = useMessageChanges(
    teams,
    LobbyService.getCurrentLobby(),
    lobbyChanging,
    openChat
  );
  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter((x) => x.name === name)[0]);
  };

  useEffect(() => {
    lobbyChanging && teams && setOpenChat(openChat + 1);
  }, [lobbyChanging, teams]);

  useEffect(() => {
    return () => {
      if (lobby && lobby.startTime) leaveLobby();
    };
  }, []);

  useEffect(() => {
    let ImInLobby =
      lobbyChanging &&
      lobbyChanging.players.includes(UserService.getCurrentPlayer().name);

    if (lobbyChanging && !ImInLobby) {
      props.history.go(-1);
      LobbyService.setLobby();
    }
    setLobby(lobbyChanging);

    passGameStarted(lobbyChanging);
  }, [lobbyChanging]);

  const passGameStarted = (lobby) => {
    if (lobby && lobby.startTime)
      if (joinedTeam || LobbyService.ImAdmin(lobby))
        props.history.replace("/play");
      else {
        leaveLobby();
      }
  };

  const handleKick = (username) => {
    let team = teams.find((x) => x.name === currentTeamDetails.name).name;
    LobbyService.kickLobby(username, team);
  };

  const handleBan = (username) => {
    console.log("banned!!!@!#!@");
    let team = teams.find((x) => x.name === currentTeamDetails.name).name;
    LobbyService.kickLobby(username, team);
    LobbyService.banPlayer(username, LobbyService.getCurrentLobby());
  };
  useEffect(() => {
    LobbyService.setCurrentTeam(joinedTeam);
  }, [joinedTeam]);

  useEffect(() => {
    currentTeamDetails &&
      setcurrentTeamDetails(
        teams.filter((x) => x.name === currentTeamDetails.name)[0]
      );
    if (!joinedTeam) {
      let joined = teams.filter((x) =>
        x.players.includes(UserService.getCurrentPlayer().name)
      );
      if (joined.length > 0) {
        LobbyService.setCurrentTeam(joined[0].name);
        setJoinedTeam(joined[0].name);
      }
    } else {
      setJoinedTeam();
    }
  }, [teams]);
  let startGame = () => {
    LobbyService.startGame(LobbyService.getCurrentLobby(), lobby);
  };
  const leaveLobby = () => {
    if (joinedTeam) {
      leaveTeam(
        LobbyService.getCurrentLobby(),
        UserService.getCurrentPlayer.name,
        teams.find((x) => x.name === joinedTeam)
      );
    }
    LobbyService.leaveLobby(
      UserService.getCurrentPlayer().name,
      currentTeamDetails && currentTeamDetails.name
    );
  };
  const joinTeam = (team) => {
    LobbyService.playerJoinTeam(
      LobbyService.getCurrentLobby(),
      team,
      UserService.getCurrentPlayer().name
    ).then(() => setJoinedTeam(team));
  };
  const leaveTeam = (lobbyId, player, team) => {
    LobbyService.leaveTeam(
      lobbyId,
      team.name,
      player,
      team.players.length
    ).then(() => setJoinedTeam());
  };

  return (
    <IonPage>
      {lobby ? (
        <>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Lobby for: </IonTitle>
              <IonTitle color="danger">{lobby.title}</IonTitle>
              <IonButtons slot="end">
                <IonButton color="danger" onClick={leaveLobby}>
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
                  {lobby.image && (
                    <IonCard>
                      <IonCardContent>
                        <IonImg
                          src={lobby.image}
                          imageViewer
                          onClick={() => PhotoViewer.show(lobby.image)}
                        ></IonImg>
                      </IonCardContent>
                    </IonCard>
                  )}
                  <IonCard>
                    <IonCardContent>
                      <IonList>
                        <IonLabel>Description:</IonLabel>
                        <IonItem text-wrap break-word>
                          {lobby.description}
                        </IonItem>
                        Nr. of Challenges
                        <IonItem>
                          <IonLabel>
                            {lobby.steps ? lobby.steps.length : 0}
                          </IonLabel>
                        </IonItem>
                        Start Location
                        <div style={{ height: "300px" }}>
                          {lobby.startLat && (
                            <MapWithLocation
                              coords={{
                                lat: lobby.startLat,
                                lng: lobby.startLng,
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
                    lobby={lobby}
                    max={lobby.maxPlayers}
                    showThisTeam={showThisTeam}
                    addPlayer
                    isAdmin={LobbyService.ImAdmin(lobby)}
                    joinedTeam={joinedTeam}
                    currentTeamDetails={currentTeamDetails}
                    handleKick={handleKick}
                    leaveTeam={leaveTeam}
                    joinTeam={joinTeam}
                    handleBan={handleBan}
                  ></TeamsContainer>
                </IonCol>

                <IonCol sizeXl="30"></IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonFooter className="ion-no-border">
            <IonToolbar>
              <IonButtons>
                {lobby.owner === UserService.getCurrentUser().userName && (
                  <IonButton
                    color="primary"
                    onClick={() => setShowAlert1(true)}
                  >
                    Start Game
                  </IonButton>
                )}

                <IonButton full onClick={() => setShowChatModal(true)}>
                  Chat
                </IonButton>
                <IonButton full onClick={() => setShowPlayersModal(true)}>
                  Players ({lobby.players.length})
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonFooter>
        </>
      ) : (
        <IonLoading isOpen={lobby} message={"Please wait..."} duration={5000} />
      )}
      <IonModal
        isOpen={showPlayersModal}
        onDidDismiss={() => setShowPlayersModal(false)}
      >
        <LobbyPlayers
          game={lobby}
          handleClose={() => setShowPlayersModal(false)}
          handleKick={handleKick}
          handleBan={handleBan}
          teams={teams}
        />
      </IonModal>
      <IonModal
        isOpen={showChatModal}
        onDidDismiss={() => setShowChatModal(false)}
      >
        {messages && (
          <ChatBoard
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
          />
        )}
        {/* 
        <ChatBoard
          teams={teams}
          lobby={lobby}
          gameChatId={LobbyService.getCurrentLobby()}
          handleClose={() => setShowChatModal(false)}
          muted={
            lobby &&
            lobby.muted &&
            lobby.muted.includes(UserService.getCurrentPlayer().name)
          }
        /> */}
      </IonModal>
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
