import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
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
import moment from "moment";

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
            <IonCol sizeXl="6" sizeSm="12" offsetXl="3">
              <IonList>
                {games && games.length > 0 ? (
                  <>
                    <IonTitle>
                      <h1>Hunts:</h1>
                    </IonTitle>
                    {games.map((x) => (
                      <IonCard key={x.gameId}>
                        <IonCardContent>
                          <IonRow>
                            <IonCol
                              sizeXl="3"
                              size="6"
                              style={{
                                alignItems: "center",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {!x.image ? (
                                <div
                                  style={{
                                    background: "grey",
                                    width: "180px",
                                    height: "100px",
                                  }}
                                ></div>
                              ) : (
                                <img
                                  src={x.image}
                                  style={{
                                    height: "100px",
                                    width: "auto",
                                    maxWidth: "130px",
                                  }}
                                />
                              )}
                            </IonCol>
                            <IonCol sizeXl="3" size="6">
                              <h2>Title:</h2>
                              <h3 style={{ fontWeight: "bold" }}>{x.title}</h3>
                              <p style={{ marginTop: "5px" }}>Date:</p>
                              {moment(x.createdDate).format("DD/MM/YYYY")}
                            </IonCol>
                            <IonCol sizeXl="3">
                              <p style={{ marginTop: "5px" }}>Entry Code:</p>
                              <h2 style={{ fontWeight: "bold" }}>
                                {x.password}
                              </h2>
                            </IonCol>

                            <IonCol sizeXl="3" size="12">
                              <p>
                                <IonButton
                                  expand="full"
                                  size="default"
                                  onClick={(e) => {
                                    LobbyService.postLobby(x).then(
                                      (response) => {
                                        joinLobby(response.id);
                                      }
                                    );
                                  }}
                                >
                                  Create Lobby
                                </IonButton>
                              </p>
                              <IonRow>
                                <IonCol>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
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
                                  </div>
                                </IonCol>
                              </IonRow>
                              <p className="ion-justify-content-center">
                                <IonButton
                                  expand="full"
                                  color="danger"
                                  size="default"
                                  onClick={() => handleDelete(x.gameId)}
                                >
                                  Delete!
                                </IonButton>
                              </p>
                            </IonCol>
                          </IonRow>
                        </IonCardContent>
                      </IonCard>
                    ))}
                  </>
                ) : (
                  games && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "20vh",
                        }}
                        className="ion-align-text-center"
                      >
                        <h1>You don't have any hunts created!</h1>
                      </div>

                      <IonButton
                        className="ion-padding-vertical"
                        expand="full"
                        onClick={() => props.history.replace("/game")}
                        size="large"
                      >
                        Create new!
                      </IonButton>
                    </>
                  )
                )}
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
