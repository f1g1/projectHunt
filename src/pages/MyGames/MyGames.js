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

import Failed from "../../components/Failed";
import { GameService } from "../../services/GameService";
import { LobbyService } from "../../services/LobbyService";
import { Network } from "@ionic-native/network";
import QrModal from "../Create/QrModal";

export default function MyGames(props) {
  const [games, setgames] = useState();
  const [showQrModal, setShowQrModal] = useState();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [offline, setoffline] = useState("");
  useEffect(() => {
    GameService.getMyGames()
      .then((x) => {
        setgames(x);
        setLoading(false);
      })
      .catch(() => setFailed(true));

    let disconnectSubscription = Network.onDisconnect().subscribe(() => {
      setoffline("OFFLINE!");
      console.log("network was disconnected :-(");
    });

    let connectSubscription = Network.onConnect().subscribe(() => {
      console.log("network connected!");
      setoffline("Online!");

      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (Network.type === "wifi") {
          console.log("we got a wifi connection, woohoo!");
        }
      }, 3000);
    });

    return () => {
      disconnectSubscription.unsubscribe();
      connectSubscription.unsubscribe();
    };
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
            {offline}
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
        {failed ? (
          <Failed />
        ) : (
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
        )}
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
