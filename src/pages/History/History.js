import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonLabel,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import HistoryDetail from "./HistoryDetail";
import { LobbyService } from "../../services/LobbyService";
import { UserService } from "../../services/UserSerivce";

var moment = require("moment");

export default function History(props) {
  const [myLobbies, setMyLobbies] = useState(
    UserService.getCurrentUser().history
  );
  const [lobbies, setLobbies] = useState([]);
  const [loading, setloading] = useState(true);
  const [selected, setSelected] = useState();
  useEffect(() => {
    if (myLobbies && myLobbies.length > 0)
      LobbyService.getHistoryGames(myLobbies.map((x) => x.lobbyId))
        .then((x) => {
          console.log(x);
          setLobbies(x);
          setloading(false);
        })
        .finally(setloading(false));
    else {
      setloading(false);
      setLobbies();
    }
  }, []);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons style={{ display: "inline-block" }}>
              <IonBackButton defaultHref="/home"></IonBackButton>
            </IonButtons>
            <IonTitle
              style={{ display: "inline-block" }}
              className="ion-text-center"
            >
              {props.endGame && "Final"} History
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading
            isOpen={loading}
            message={"Please wait..."}
            duration={5000}
          />

          {(loading === false && lobbies === undefined) ||
            (lobbies.length === 0 && (
              <IonTitle
                className="ion-text-center ion-padding-top"
                style={{ visible: !loading, marginTop: "10vh" }}
              >
                <h1 className="ion-text-wrap">
                  You need to play some games to see your history!
                </h1>
              </IonTitle>
            ))}
          <IonRow className="ion-padding-top">
            <IonCol sizeXl="6" size="12" offsetXl="3">
              {!loading && lobbies && lobbies.length > 0 && (
                <>
                  <IonTitle className="ion-padding-vertical ion-no-padding">
                    <h1>Your hunt history:</h1>
                  </IonTitle>

                  {lobbies.map((x) => {
                    return (
                      <IonCard color="light" onClick={() => setSelected(x)}>
                        <IonCardContent>
                          <IonRow>
                            <IonCol size="4">
                              <h2>Title:</h2>
                              <IonLabel>
                                <h2 style={{ fontWeight: "bold" }}>
                                  {" "}
                                  {x.title}
                                </h2>
                              </IonLabel>
                            </IonCol>
                            <IonCol size="4">
                              <h2>Date:</h2>

                              <IonLabel>
                                <h2 style={{ fontWeight: "bold" }}>
                                  {x.finishTime &&
                                    moment(x.finishTime.seconds * 1000).format(
                                      "DD/MM HH:mm"
                                    )}
                                </h2>
                              </IonLabel>
                            </IonCol>
                            <IonCol size="4">
                              <h2>Creadet by</h2>
                              <IonLabel>
                                <h2 style={{ fontWeight: "bold" }}>
                                  {x.owner}
                                </h2>
                              </IonLabel>
                            </IonCol>
                          </IonRow>
                        </IonCardContent>
                      </IonCard>
                    );
                  })}
                </>
              )}
            </IonCol>
          </IonRow>
        </IonContent>
      </IonPage>

      <IonModal
        isOpen={selected !== undefined}
        onDidDismiss={() => setSelected()}
      >
        <HistoryDetail
          handleClose={() => setSelected()}
          finalLeaderboard={selected && selected.finalLeaderboard}
          game={selected}
        />
      </IonModal>
    </>
  );
}
