import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonHeader,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import React from "react";
import { UserService } from "../../services/UserSerivce";

export default function HistoryDetail(props) {
  return (
    <>
      <IonToolbar color="primary">
        <IonHeader lines="none">
          <IonButton onclick={props.handleClose} color="danger">
            X
          </IonButton>
          <IonTitle
            style={{ display: "inline-block" }}
            className="ion-text-center"
          >
            LeaderBoard
          </IonTitle>
        </IonHeader>
      </IonToolbar>
      <IonGrid fixed full>
        <IonCard color="light" style={{ marginBottom: "30px" }}>
          <IonCardContent>
            <IonRow color="priamry">
              <IonCol>Place</IonCol>
              <IonCol>
                <h2 style={{ textDecoration: "bold" }}>Team</h2>
              </IonCol>
              <IonCol>
                <IonLabel>Points</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Last Completed</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Players</IonLabel>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        {props.finalLeaderboard &&
          props.finalLeaderboard
            .sort(function (a, b) {
              return b.points - a.points || a.lastTime - b.lastTime;
            })
            .map((x, index) => (
              <IonCard
                color={
                  x.players.includes(UserService.getCurrentPlayer().name) &&
                  "primary"
                }
              >
                <IonCardContent
                  color={
                    x.players.includes(UserService.getCurrentPlayer().name) &&
                    "primary"
                  }
                >
                  <IonRow key={x.name}>
                    <IonCol>#{index + 1}</IonCol>
                    <IonCol>{x.name}</IonCol>
                    <IonCol>
                      <IonLabel>{x.points}</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>{x.lastTime}</IonLabel>
                    </IonCol>
                    <IonCol>
                      <IonLabel>
                        {x.players.map((z) => {
                          return <p>{z}</p>;
                        })}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            ))}
      </IonGrid>
    </>
  );
}
