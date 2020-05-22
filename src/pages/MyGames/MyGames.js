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
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { GameService } from "../../services/GameService";
import { LobbyService } from "../../services/LobbyService";
import QrModal from "../Create/QrModal";

export default function MyGames(props) {
  const [games, setgames] = useState();
  const [showQrModal, setShowQrModal] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    GameService.getMyGames().then((x) => {
      setgames(x);
      setLoading(false);
    });
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

            <IonTitle>My hunts</IonTitle>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading
          isOpen={loading}
          message={"Please wait..."}
          duration={5000}
        />
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
                    <IonButton
                      color="dark"
                      onClick={() => handleEdit(x)}
                      className="ion-margin-start"
                    >
                      Edit
                    </IonButton>
                    <IonButton
                      className="ion-margin-horizontal"
                      color="dark"
                      onClick={() => setShowQrModal(x.steps)}
                    >
                      QRs
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
      <IonModal
        isOpen={showQrModal !== undefined}
        onDidDismiss={() => setShowQrModal()}
      >
        <QrModal
          handleClose={() => setShowQrModal()}
          steps={showQrModal}
        ></QrModal>
      </IonModal>
    </IonPage>
  );
}
