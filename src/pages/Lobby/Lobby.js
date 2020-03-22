import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonTitle, IonCol, IonRow, IonToolbar, IonGrid, IonLoading, IonButton } from "@ionic/react";
import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import "./Lobby.scss"
import TeamsContainer from "./TeamsContainer";
import TeamPanel from "./TeamPanel"
import { LobbyService } from "../../services/LobbyService";
import { UserService } from "../../services/UserSerivce";
import useTeamChanges from "../../services/useTeamChanges";



export default function Lobby(props) {
  const [lobby, setLobby] = useState()
  const [joinedTeam, setJoinedTeam] = useState()
  const teams = useTeamChanges()

  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  console.log(lobby)
  // const [maxPlayers, setmaxPlayers] = useState()
  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter(x => x.name === name)[0])
  }

  useEffect(() => {
    setJoinedTeam(LobbyService.getCurrentTeam());
  })

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


  // const playerJoinTeam = (teamName, player) => {
  //   LobbyService.playerJoinTeam(LobbyService.getCurrentLobby(), teamName, player)

  // }
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
                  <TeamsContainer teams={teams} max={lobby.maxPlayers} showThisTeam={showThisTeam} addPlayer joinedTeam={joinedTeam}></TeamsContainer>
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12" key="2">
                  {currentTeamDetails && <TeamPanel team={currentTeamDetails} max={lobby.maxPlayers} leaveTeam={leaveTeam} canJoin={joinedTeam} joinTeam={joinTeam}></TeamPanel>}
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
