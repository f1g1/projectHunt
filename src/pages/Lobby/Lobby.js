import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonTitle, IonCol, IonRow, IonToolbar, IonGrid, IonLoading, IonButton, IonLabel, IonCard, IonList, IonCardContent, IonItem, IonItemDivider, IonButtons } from "@ionic/react";
import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import "./Lobby.scss"
import TeamsContainer from "./TeamsContainer";
import TeamPanel from "./TeamPanel"
import { LobbyService } from "../../services/LobbyService";
import { UserService } from "../../services/UserSerivce";
import useTeamChanges from "../../services/useTeamChanges";
import MapWithLocation from "../../components/Map/Map";



export default function Lobby(props) {
  const [lobby, setLobby] = useState()
  const [joinedTeam, setJoinedTeam] = useState()
  const teams = useTeamChanges()
  console.log(lobby)
  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  console.log(lobby)
  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter(x => x.name === name)[0])
  }
  useEffect(() => {
    setJoinedTeam(LobbyService.getCurrentTeam());
    if (lobby && lobby.startTime)
      props.history.push({ pathname: "/play", lobby });
  }, [lobby])

  useEffect(() => {
    console.log("lobby", props.location.lobbyId);
    LobbyService.getLobby(props.location.lobbyId || LobbyService.getCurrentLobby())
      .then(x => {
        setLobby(x);

      });
    return () => {
      LobbyService.leaveLobby()
    }
  }, [])
  useEffect(() => {
    currentTeamDetails && setcurrentTeamDetails(teams.filter(x => x.name === currentTeamDetails.name)[0])
    if (!joinedTeam) {
      let joined = teams.filter(x => x.players.includes(UserService.getCurrentPlayer().name));
      if (joined.length > 0)
        setJoinedTeam(joined[0].name)
    }
  }, [teams])
  let startGame = () => {
    debugger;
    LobbyService.startGame(lobby.id);
  }
  const leaveLobby = () => {
    debugger;
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
                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" >
                  <TeamsContainer teams={teams} max={lobby.maxPlayers} showThisTeam={showThisTeam} addPlayer joinedTeam={joinedTeam}></TeamsContainer>
                </IonCol>
                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" key="2">
                  {currentTeamDetails && <TeamPanel team={currentTeamDetails} max={lobby.maxPlayers} leaveTeam={leaveTeam} canJoin={joinedTeam} joinTeam={joinTeam}></TeamPanel>}
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
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
                            {lobby.steps.length}
                          </IonLabel>
                        </IonItem>
                        Start Location
                        <div style={{ height: "300px" }}>
                          {lobby.startLat && <MapWithLocation coords={{ lat: lobby.startLat, lng: lobby.startLng }}></MapWithLocation>}
                        </div>
                      </IonList>
                      {lobby.owenr === UserService.getCurrentUser.email && <IonButton color="primary" onClick={startGame}>Start Game</IonButton>}
                    </IonCardContent>
                  </IonCard>

                </IonCol>
                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
                  <IonRow>

                    <img src={lobby.image} imageViewer ></img>
                  </IonRow>
                  <IonRow className="standardMarign">
                    <ChatBoard gameChatId={LobbyService.getCurrentLobby()} />
                  </IonRow>
                </IonCol>

              </IonRow>

            </IonGrid>
          </IonContent>

        </>
        : <IonLoading
          isOpen={lobby}
          message={'Please wait...'}
          duration={5000} />}
    </IonPage >
  );

}
