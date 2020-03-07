import React, { useState } from "react";
import { GamesService } from "../../services/GameService";
import {
  IonCol,
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonButton,
  IonLabel,
  IonRow
} from "@ionic/react";
import { VISIBILITY, LobbyService } from "../../services/LobbyService";

export default function MyGames(props) {
  const [games, setgames] = useState();
  GamesService.getMyGames().then(x => setgames(x));
  return (
    <IonPage>
      <IonContent>
        <IonRow>
          <IonCol sizeXl="4" sizeSm="12">
            <IonList>
              {games &&
                games.map(x => (

                  <IonItem>

                    <IonLabel >
                      {x.title}
                    </IonLabel>
                    <IonButton size="default" onClick={e => {
                      LobbyService.postLobby(x).then(id => {
                        props.history.push({ pathname: "/lobby", lobbyId: id });

                      })
                    }}>Create Game</IonButton>

                    <IonButton color="danger" size="default">
                      Delete!
                    </IonButton>
                  </IonItem>))}
            </IonList>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}
