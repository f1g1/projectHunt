import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { GameService } from "../../services/GameService";
import { LobbyService } from "../../services/LobbyService";

export default function MyGames(props) {
  const [games, setgames] = useState();
  useEffect(() => {
    GameService.getMyGames().then((x) => setgames(x));
  }, []);

  const handleDelete = (id) => {
    GameService.deleteGame(id).then(() => {
      let filtered = games.filter((x) => x.gameId !== id);
      setgames(filtered);
    });
  };
  const handleEdit = (game) => {
    props.history.push({ pathname: "/game", game });
  };

  const joinLobby = (lobbyId) => {
    LobbyService.joinLobby(lobbyId).then(() => {
      props.history.replace({ pathname: "/lobby", lobbyId: lobbyId });
    });
    LobbyService.setLobby(lobbyId);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons>
            <IonBackButton defaultHref="/home"></IonBackButton>

            <IonTitle>My games</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow className="ion-padding-top">
          <IonCol sizeXl="4" sizeSm="12" offsetXl="3">
            <IonList>
              {games &&
                games.map((x) => (
                  <IonItem key={x.gameId}>
                    <IonLabel>{x.title}</IonLabel>
                    <IonButton
                      size="default"
                      onClick={(e) => {
                        LobbyService.postLobby(x).then((response) => {
                          joinLobby(response.id);
                        });
                      }}
                    >
                      Create Lobby
                    </IonButton>
                    <IonButton color="dark" onClick={() => handleEdit(x)}>
                      Edit
                    </IonButton>

                    <IonButton
                      color="danger"
                      size="default"
                      onClick={() => handleDelete(x.gameId)}
                    >
                      Delete!
                    </IonButton>
                  </IonItem>
                ))}
            </IonList>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}
