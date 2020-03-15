import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonTitle, IonCol, IonRow, IonToolbar, IonGrid, IonItem, IonLoading, IonButton } from "@ionic/react";
import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import "./Lobby.scss"
import TeamsContainer from "./TeamsContainer";
import TeamPanel from "./TeamPanel"
import { LobbyService } from "../../services/LobbyService";
import LobbySearch from "../LobbySearch/LobbySearch";
import { UserService } from "../../services/UserSerivce";
import useTeamChanges from "../../services/useTeamChanges";



export default function Lobby(props) {
  const [lobby, setLobby] = useState()
  const [canJoin, setcanJoin] = useState(true)
  const teams = useTeamChanges()

  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  console.log(lobby)
  // const [maxPlayers, setmaxPlayers] = useState()
  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter(x => x.name === name)[0])
  }
  useEffect(() => {

    console.log("lobby", props.location.lobbyId);
    LobbyService.getLobby(props.location.lobbyId || LobbyService.getCurrentLobby())
      .then(x => {
        setLobby(x);

      });

  }, [])
  useEffect(() => {
    currentTeamDetails && setcurrentTeamDetails(teams.filter(x => x.name === currentTeamDetails.name)[0])
  }, [teams])


  // const playerJoinTeam = (teamName, player) => {
  //   LobbyService.playerJoinTeam(LobbyService.getCurrentLobby(), teamName, player)

  // }
  const leaveLobby = () => {
    LobbyService.leaveLobby();
    props.history.push({ pathname: "/lobbysearch" });
  }
  const leaveTeam = (lobby, player, team) => {
    LobbyService.leaveTeam(lobby, player, team).then(() => setcanJoin(true))
  }
  const joinTeam = (team) => {
    debugger;
    LobbyService.playerJoinTeam(LobbyService.getCurrentLobby(), team, UserService.getCurrentPlayer().name)
      .then(() => setcanJoin(false))
  }
  return (
    <IonPage>
      {lobby ?
        <>
          <IonHeader>
            <IonToolbar color="primary">
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonTitle>Lobby for: </IonTitle>
                    <IonTitle color="danger">
                      {lobby.title}
                    </IonTitle>
                  </IonCol>
                  <IonCol size="3" offset="3">
                    <IonButton color="danger" onClick={leaveLobby}>
                      Leave
            </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonToolbar>
          </IonHeader>

          <IonContent >

            <IonGrid >
              <IonRow fixed>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" >
                  <TeamsContainer teams={teams} max={lobby.maxPlayers} showThisTeam={showThisTeam} addPlayer></TeamsContainer>
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" key="2">
                  {currentTeamDetails && <TeamPanel team={currentTeamDetails} max={lobby.maxPlayers} leaveTeam={leaveTeam} canJoin joinTeam={joinTeam}></TeamPanel>}
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">

                  <ChatBoard gameChatId={LobbyService.getCurrentLobby()} />

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
