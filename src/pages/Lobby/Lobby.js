import React, { useState } from "react";
import { IonContent, IonPage, IonHeader, IonTitle, IonCol, IonRow, IonToolbar, IonGrid } from "@ionic/react";
import ChatBoard from "../../components/Chat/ChatBoard/ChatBoard";
import "./Lobby.scss"
import TeamsContainer from "./TeamsContainer";
import TeamPanel from "./TeamPanel"

let teamss = [{
  "name": "da", "story": " We are a set of pirates that will Get thee Crowwn", "members": [123124, 12313, 15343434, 1212132]
}, { "name": "Super MEga team", "members": [123124, 12313, 15343434, 1212132] }, { "name": "Tirodic", "members": [123124, 12313, 15343434, 1212132] }, { "name": "da", "members": [123124, 12313, 15343434, 1212132] }]


export default function Lobby(props) {
  const [game, setGame] = useState(props.location.state)
  const [teams, setteams] = useState(teamss)
  const [currentTeamDetails, setcurrentTeamDetails] = useState();

  const showThisTeam = (name) => {
    setcurrentTeamDetails(teams.filter(x => x.name === name)[0])
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Lobby for {game.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fixed>

        <IonGrid >
          <IonRow fixed>

            <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
              <TeamsContainer teams={teams} showThisTeam={showThisTeam}></TeamsContainer>
            </IonCol>

            <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">
              {currentTeamDetails && <TeamPanel team={currentTeamDetails}></TeamPanel>}
            </IonCol>

            <IonCol sizeLg="4" sizeXl="3" sizeMd="5" sizeXs="12">

              <ChatBoard gameChatId={game.id} />

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonContent>



      </IonContent>
    </IonPage >
  );
}
