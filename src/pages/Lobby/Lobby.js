import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonTitle, IonCol, IonRow, IonToolbar, IonGrid, IonItem, IonLoading, IonButton } from "@ionic/react";
import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import "./Lobby.scss"
import TeamsContainer from "./TeamsContainer";
import TeamPanel from "./TeamPanel"
import { LobbyService } from "../../services/LobbyService";
import LobbySearch from "../LobbySearch/LobbySearch";
import { UserService } from "../../services/UserSerivce";



export default function Lobby(props) {
  const [lobby, setLobby] = useState()
  const [teams, setteams] = useState()
  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  console.log(lobby)
  // const [maxPlayers, setmaxPlayers] = useState()
  const showThisTeam = (name) => {
    console.log("current", teams[name]);
    setcurrentTeamDetails(teams[name])
  }
  useEffect(() => {
    console.log("lobby", props.location.lobbyId);
    LobbyService.getLobby(LobbyService.getCurrentLobby())
      .then(x => {
        setLobby(x);
      });

  }, [])
  useEffect(() => {
    console.log(teams)
  }, [teams])


  // const playerJoinTeam = (teamName, player) => {
  //   LobbyService.playerJoinTeam(LobbyService.getCurrentLobby(), teamName, player)

  // }
  const leaveLobby = () => {
    LobbyService.leaveLobby();
    props.history.push({ pathname: "/lobbysearch" });
  }
  const leaveTeam = () => {
    LobbyService.leaveTeam(UserService.getCurrentPlayer.name, props.location.lobbyId)
  }
  return (
    <IonPage>
      {lobby ?
        <>
          <IonHeader>
            <IonToolbar color="primary">
              <IonItem lines="none" color="primary">
                <IonTitle>Lobby for {lobby.title}</IonTitle>
                <IonButton color="danger" onClick={leaveLobby}>
                  Leave
            </IonButton>
              </IonItem>

            </IonToolbar>


          </IonHeader>

          <IonContent fixed>

            <IonGrid >
              <IonRow fixed>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" >
                  <TeamsContainer teams={teams} players={lobby.players} max={lobby.maxPlayers} showThisTeam={showThisTeam} addPlayer></TeamsContainer>
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" key="2">
                  {currentTeamDetails && <TeamPanel team={currentTeamDetails} max={lobby.maxPlayers} leaveTeam={leaveTeam}></TeamPanel>}
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">

                  <ChatBoard gameChatId={LobbyService.getCurrentLobby()} />

                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>

          <IonContent>



          </IonContent>
        </>
        : <IonLoading
          isOpen={lobby}
          message={'Please wait...'}
          duration={5000} />}
    </IonPage >
  );

}
