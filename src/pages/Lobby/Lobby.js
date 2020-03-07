import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonTitle, IonCol, IonRow, IonToolbar, IonGrid, IonItem, IonLoading } from "@ionic/react";
import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import "./Lobby.scss"
import TeamsContainer from "./TeamsContainer";
import TeamPanel from "./TeamPanel"
import { LobbyService } from "../../services/LobbyService";

let teamss = [{
  "name": "da", "story": " We are a set of pirates that will Get thee Crowwn", "members": [123124, 12313, 15343434, 1212132]
}, { "name": "Super MEga team", "members": [12313, 15343434, 1212132] }, { "name": "Tirodic", "members": [123124, 15343434, 1212132] }, { "name": "da", "members": [123124, 12313, 15343434, 1212132] }]


export default function Lobby(props) {
  const [lobby, setLobby] = useState()
  const [teams, setteams] = useState(teamss)
  const [currentTeamDetails, setcurrentTeamDetails] = useState();
  // const [maxPlayers, setmaxPlayers] = useState()
  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter(x => x.name === name)[0])
  }
  useEffect(() => {
    console.log("lobby", props.location.lobbyId);
    LobbyService.getLobby(props.location.lobbyId).then(x => setLobby(x));
  }, [])

  const addPlayer = (teamName, player) => {

  }

  return (



    <IonPage>
      {lobby ?
        <>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Lobby for {lobby.title}</IonTitle>
            </IonToolbar>
            <IonItem>

            </IonItem>
          </IonHeader>

          <IonContent fixed>

            <IonGrid >
              <IonRow fixed>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
                  <TeamsContainer teams={teams} max={lobby.maxPlayers} showThisTeam={showThisTeam} addPlayer></TeamsContainer>
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
                  {currentTeamDetails && <TeamPanel team={currentTeamDetails}></TeamPanel>}
                </IonCol>

                <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">

                  <ChatBoard gameChatId={props.location.lobbyId} />

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
