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

  useEffect(() => {
    setdate(new Date());
  }, []);
  const joinLobby = (lobby) => {
    debugger;
    LobbyService.joinLobby(lobby.lobbyId).then(() => {
      if (!lobby.startTime)
        props.history.push({ pathname: "/lobby", lobbyId: lobby.lobbyId });
      else {
        LobbyService.setLobby(lobby.lobbyId);

        props.history.push({ pathname: "/play", lobby });
      }
    });
    LobbyService.setLobby(lobby.lobbyId);
  };
  const handleSearch = () => {
    if (!searchString || searchString.length < 3)
      setErrorToast("Entry Code must be at least 3 characters long!");
    else {
      setShowLoading(true);
      LobbyService.getLobbies(searchString).then((x) => {
        setlobbies(x);
        setShowLoading(false);
        x.length > 0
          ? setResults(`We found these results with the code: ${searchString}`)
          : setResults(
              `We didn't found any results with the code: ${searchString}`
            );
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
                <IonItem>
                  <IonLabel>Entry Code:</IonLabel>
                  <IonInput
                    required
                    value={searchString}
                    onIonChange={(e) => setSearchString(e.target.value)}
                    placeholder="Type your Entry code here!"
                    maxlength="20"
                  ></IonInput>
                  <IonButton onClick={handleSearch}>Search</IonButton>
                </IonItem>
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
