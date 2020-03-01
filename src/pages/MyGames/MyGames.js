import React, { useState } from "react";
import { GamesService } from "../../services/GameService";
import {
  IonCol,
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonButton
} from "@ionic/react";

export default function MyGames(props) {
  const [games, setgames] = useState();
  GamesService.getMyGames().then(x => setgames(x));
  return (
    <IonPage>
      <IonContent>
        <IonList>
          {games &&
            games.map(x => (
              <IonItem>
                <IonCol size="12">
                  <IonButton
                    expand="full"
                    size="large"
                    fill="clear"
                    color="dark"
                    onClick={e => {
                      e.preventDefault();
                      props.history.push({ pathname: "/lobby", state: x });
                    }}
                  >
                    {x.title}
                  </IonButton>
                </IonCol>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
