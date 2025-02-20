import {
  IonBackButton,
  IonButton,
  IonButtons,
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

import CloseIcon from "@material-ui/icons/Close";
import { PlayService } from "../../services/PlayService";
import React from "react";

var moment = require("moment");

export default function LeaderBoard(props) {
  return (
    <>
      <IonHeader ion-no-padding>
        <IonToolbar color="primary">
          <div style={{ display: "flex", alignItems: "center" }}>
            {!props.endGame ? (
              // <IonButton
              //   shape="round"
              //   onclick={props.handleClose}
              //   color="danger"
              //   className="ion-margin-start"
              // >
              //   X
              // </IonButton>
              <IonButtons style={{ display: "inline-block" }}>
                <IonButton shape="round" onclick={props.handleClose}>
                  <CloseIcon />
                </IonButton>
              </IonButtons>
            ) : (
              <IonButtons style={{ display: "inline-block" }}>
                <IonBackButton defaultHref="/home"></IonBackButton>
              </IonButtons>
            )}
            <IonTitle style={{ display: "inline-block" }}>
              {props.endGame && "Final"} Leaderboard
            </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonGrid fixed full>
        <IonCard color="light" style={{ marginBottom: "30px" }}>
          <IonCardContent>
            <IonRow color="priamry">
              <IonCol>
                <h2 style={{ textDecoration: "bold" }}>Team</h2>
              </IonCol>
              <IonCol>
                <IonLabel>Completed</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Points</IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Last</IonLabel>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        {props.teams &&
          props.teams.map((x) => (
            <IonCard key={x.name}>
              <IonCardContent>
                <IonRow>
                  <IonCol>{x.name}</IonCol>
                  <IonCol>
                    <IonLabel>{x.completed ? x.completed.length : 0}</IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>
                      {PlayService.getTotalPoints(x, props.game) || 0}
                    </IonLabel>
                  </IonCol>
                  <IonCol>
                    <IonLabel>
                      {x.completed && x.completed.length > 0
                        ? moment(
                            x[x.completed[x.completed.length - 1]].time
                              .seconds * 1000
                          ).format("DD/MM HH:mm")
                        : "N/A"}
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
