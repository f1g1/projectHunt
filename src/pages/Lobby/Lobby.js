import "./Lobby.scss";

import { IonButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";

import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import { LobbyService } from "../../services/LobbyService";
import MapWithLocation from "../../components/Map/Map";
import TeamPanel from "./TeamPanel";
import TeamsContainer from "./TeamsContainer";
import { UserService } from "../../services/UserSerivce";
import useTeamChanges from "../../services/useTeamChanges";

export default function Lobby(props) {
  const [lobby, setLobby] = useState()
  const [joinedTeam, setJoinedTeam] = useState()
  const teams = useTeamChanges(props.location.lobbyId)
  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  const [showChatModal, setShowChatModal] = useState(false)

  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter(x => x.name === name)[0])
  }

  const passGameStarted = () => {
    if (lobby && lobby.startTime && joinedTeam)
      props.history.push({ pathname: "/play", lobby });
  }

  useEffect(() => {
    passGameStarted()

  }, [lobby])

  useEffect(() => {
    console.log("lobby", props.location.lobbyId);
    LobbyService.setLobby(props.location.lobbyId)
    LobbyService.getLobby(props.location.lobbyId || LobbyService.getCurrentLobby())
      .then(x => {
        setLobby(x);

      });
  }, [])
  useEffect(() => {
    currentTeamDetails && setcurrentTeamDetails(teams.filter(x => x.name === currentTeamDetails.name)[0])
    if (!joinedTeam) {
      let joined = teams.filter(x => x.players.includes(UserService.getCurrentPlayer().name));
      if (joined.length > 0) {
        LobbyService.setCurrentTeam(joined[0].name)
        setJoinedTeam(joined[0].name)

      }
    }
  }, [teams])
  let startGame = () => {
    debugger;
    LobbyService.startGame(lobby.id);
  }
  const leaveLobby = () => {
    LobbyService.leaveLobby();
    props.history.push({ pathname: "/lobbysearch" });
  }
  const leaveTeam = (lobby, player, team) => {
    LobbyService.leaveTeam(lobby, player, team).then(() => setJoinedTeam(true))
  }
  const joinTeam = (team) => {
    LobbyService.playerJoinTeam(LobbyService.getCurrentLobby(), team, UserService.getCurrentPlayer().name)
      .then(() => setJoinedTeam(false))
  }
  return (
    <IonPage>
      {lobby ?
        <>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Lobby for: </IonTitle>
              <IonTitle color="danger">
                {lobby.title}
              </IonTitle>
              <IonButtons slot="end">

                <IonButton color="danger" onClick={leaveLobby}>
                  Leave
            </IonButton>
              </IonButtons>

            </IonToolbar>
          </IonHeader>
          <IonContent >
            <IonGrid >
              <IonRow fixed>
                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" offsetXl="1.5" >
                  <TeamsContainer teams={teams} max={lobby.maxPlayers} showThisTeam={showThisTeam} addPlayer joinedTeam={joinedTeam}></TeamsContainer>
                </IonCol>
                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" key="2">
                  {currentTeamDetails && <TeamPanel team={currentTeamDetails} max={lobby.maxPlayers} leaveTeam={leaveTeam} canJoin={joinedTeam} joinTeam={joinTeam}></TeamPanel>}
                </IonCol>
                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
                  <IonCard>
                    <IonCardContent>
                      <img src={lobby.image} imageViewer ></img>
                    </IonCardContent>
                  </IonCard>
                  <IonCard>
                    <IonCardContent>
                      <IonList>
                        <IonLabel>
                          Description:
                      </IonLabel>
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
                          {lobby.startLat && <MapWithLocation coords={{ lat: lobby.startLat, lng: lobby.startLng }}></MapWithLocation>}
                        </div>
                      </IonList>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonFooter className="ion-no-border">
            <IonToolbar>
              <IonButtons >
                {lobby.owner === (UserService.getCurrentUser().userName) && <IonButton color="primary" onClick={startGame}>Start Game</IonButton>}

                <IonButton full onClick={() => setShowChatModal(true)}>
                  Chat
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonFooter>
        </>
        : <IonLoading
          isOpen={lobby}
          message={'Please wait...'}
          duration={5000} />}

      <IonModal
        isOpen={showChatModal}
        onDidDismiss={() => setShowChatModal(false)}
      >
        <ChatBoard gameChatId={LobbyService.getCurrentLobby()}
          handleClose={() => setShowChatModal(false)}
        />
      </IonModal>
    </IonPage >
  );

}
