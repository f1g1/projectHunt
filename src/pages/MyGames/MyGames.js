import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";

import { GamesService } from "../../services/GameService";
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
                        LobbyService.setLobby(id)
                        props.history.push({ pathname: "/lobby", lobbyId: id.id });

                      })
                    }}>Create Lobby</IonButton>
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
