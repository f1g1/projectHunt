import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonHeader,
  IonLabel,
  IonRow,
  IonToolbar,
} from "@ionic/react";

import React from "react";
import { UserService } from "../../services/UserSerivce";
import moment from "moment";

export default function HistoryDetail(props) {
  return (
    <>
      <IonHeader lines="none">
        <IonToolbar color="primary">
          <div style={{ display: "flex", alignItems: "center" }}>
            <IonButton
              shape="round"
              onclick={props.handleClose}
              color="danger"
              className="ion-padding-horizontal"
            >
              X
            </IonButton>
            <IonLabel>
              <h1>Game: {props.game.title}</h1>
              <p>
                Date: {moment(props.game.finishedDate).format("DD/MM/YYYY")}
              </p>
            </IonLabel>
          </div>
        </IonToolbar>
      </IonHeader>

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
