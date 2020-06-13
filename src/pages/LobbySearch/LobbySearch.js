import "./LobbySearch.scss";

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRow,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { LobbyService } from "../../services/LobbyService";
import { UserService } from "../../services/UserSerivce";
import moment from "moment";

export default function LobbySearch(props) {
  const [lobbies, setlobbies] = useState([]);
  const [date, setdate] = useState();
  const [searchString, setSearchString] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [Results, setResults] = useState(null);
  const [errorToast, setErrorToast] = useState();
  const [useCode, setUsecode] = useState(false);

  const openScanner = async () => {
    BarcodeScanner.scan()
      .then((barcodeData) => {
        if (barcodeData.text.length > 2) {
          setSearchString(barcodeData.text);
          handleSearch(barcodeData.text);
          setUsecode(true);
        }
      })
      .catch((err) => {
        console.log("Qr scan failed");
      });
  };

  useEffect(() => {
    setdate(new Date());
  }, []);
  const joinLobby = (lobby) => {
    try {
      LobbyService.joinLobby(lobby.lobbyId)
        .then(() => {
          if (!lobby.startTime) {
            LobbyService.setLobby(lobby.lobbyId);

            props.history.push({ pathname: "/lobby", lobbyId: lobby.lobbyId });
          } else {
            throw "";
          }
        })
        .catch(() => {
          setErrorToast("You can't join this lobby anymore!");
          setlobbies([]);
          setSearchString("");
        });
    } catch {
      setErrorToast("You can't join this lobby anymore!");
      setlobbies([]);
      setSearchString("");
    }
  };
  const handleSearch = (text) => {
    if (!text || text.length < 3)
      setErrorToast("Entry Code must be at least 3 characters long!");
    else {
      setShowLoading(true);
      LobbyService.getLobbies(text).then((x) => {
        setlobbies(x);
        setShowLoading(false);
        x.length > 0
          ? setResults(`We found these results with the code: ${text}`)
          : setResults(`We didn't found any results with the code: ${text}`);
      });
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons style={{ display: "inline-block" }}>
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <h1 style={{ display: "inline-block" }}>Search Game...</h1>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow style={{ marginTop: "5%" }}>
          <IonCol sizeXl="5" sizeSm="12" offsetXl="3.5">
            <IonCard color="light">
              <IonCardContent>
                {!useCode && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <IonButton
                      shape="round"
                      size="large"
                      className="ion-no-padding"
                      onClick={() => {
                        openScanner();
                      }}
                    >
                      Scan QR!
                    </IonButton>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <IonLabel
                        className="ion-text-center ion-padding-vertical"
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => setUsecode(true)}
                      >
                        Use code instead
                      </IonLabel>
                    </div>
                  </div>
                )}
                {useCode && (
                  <>
                    <IonItem>
                      <IonLabel>Entry Code:</IonLabel>
                      <IonInput
                        required
                        value={searchString}
                        onIonChange={(e) => setSearchString(e.target.value)}
                        placeholder="Type Code!"
                        maxlength="20"
                      ></IonInput>
                      <IonButton
                        shape="round"
                        size="default"
                        onClick={() => handleSearch(searchString)}
                      >
                        Search
                      </IonButton>
                    </IonItem>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <IonLabel
                        className="ion-text-center ion-padding-vertical"
                        style={{
                          width: "100%",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => setUsecode(false)}
                      >
                        Use QR code instead
                      </IonLabel>
                    </div>
                  </>
                )}
              </IonCardContent>
            </IonCard>

            <IonList>
              <h1 className="ion-padding">{Results}</h1>
              {lobbies &&
                lobbies.map((x) => (
                  <IonCard key={x.owner + x.lobbyCreatedDate}>
                    <IonCardHeader color="primary">
                      <IonCardTitle>{x.title} </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonGrid>
                        <IonRow>
                          <IonCol size="4">
                            {x.image ? (
                              <img
                                src={x.image}
                                style={{ maxWidth: "250px", height: "120px" }}
                              ></img>
                            ) : (
                              <IonLabel>
                                <p>no Image</p>
                              </IonLabel>
                            )}
                          </IonCol>

                          <IonCol size="8" className="ion-no-padding">
                            <IonRow>
                              <IonCol size="12">
                                <IonItem>
                                  {x.banned &&
                                  x.banned.includes(
                                    UserService.getCurrentPlayer().name
                                  ) ? (
                                    <IonLabel color="danger">
                                      You have been banned on this lobby!
                                    </IonLabel>
                                  ) : (
                                    <IonButton
                                      shape="round"
                                      size="default"
                                      onClick={() => joinLobby(x)}
                                    >
                                      Join Lobby!
                                    </IonButton>
                                  )}
                                </IonItem>
                              </IonCol>
                              <IonCol size="12" className="ion-padding-start">
                                <h4>Description:</h4>
                                <IonLabel>{x.description}</IonLabel>
                              </IonCol>
                            </IonRow>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                      <IonItem lines="none">
                        {x.lobbyCreatedDate && (
                          <p>
                            Created{" "}
                            {moment(date).diff(
                              moment(x.lobbyCreatedDate),
                              "minutes"
                            )}{" "}
                            minutes ago
                          </p>
                        )}

                        <IonLabel slot="end">
                          <p>by {x.owner}</p>
                        </IonLabel>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                ))}
            </IonList>
          </IonCol>
        </IonRow>
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          message={"Please wait..."}
          duration={5000}
        />
        <IonToast
          color="danger"
          position="top"
          isOpen={errorToast !== undefined}
          onDidDismiss={() => setErrorToast()}
          message={errorToast}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
}
