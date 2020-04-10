import React, { useState, useEffect } from "react";
import { GamesService } from "../../services/GameService";
import {
  IonCol,
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonButton,
  IonLabel,
  IonRow,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonButtons
} from "@ionic/react";
import { LobbyService } from "../../services/LobbyService";

export default function MyGames(props) {
  const [games, setgames] = useState();
  useEffect(() => {
    GamesService.getMyGames().then(x => setgames(x));

  }, [])
  console.log(games);

  const handleDelete = (id) => {
    GamesService.deleteGame(id).then(() => {
      let filtered = games.filter(x => x.gameId !== id);
      debugger;
      setgames(filtered);
    })
  }
  const handleEdit = (game) => {
    props.history.push({ pathname: "/game", game });

  }

  return (

    < IonPage >
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons>
            <IonBackButton defaultHref="/home"></IonBackButton>

          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow className="ion-padding-top">
          <IonCol sizeXl="4" sizeSm="12" offsetXl="3">
            <IonTitle>
              My games
            </IonTitle>
            <IonList>
              {games &&
                games.map(x => (

                  <IonItem key={x.gameId}>

                    <IonLabel >
                      {x.title}
                    </IonLabel>
                    <IonButton size="default" onClick={e => {
                      LobbyService.postLobby(x).then(id => {
                        props.history.push({ pathname: "/lobby", lobbyId: id.id });

                      })
                    }}>Create Game</IonButton>
                    <IonButton color="dark" onClick={() => handleEdit(x)}>Edit</IonButton>

                    <IonButton color="danger" size="default" onClick={() => handleDelete(x.gameId)}>
                      Delete!
                    </IonButton>
                  </IonItem>))}
            </IonList>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage >
  );
}
