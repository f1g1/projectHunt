import {
  IonButton,
  IonCardContent,
  IonContent,
  IonHeader,
  IonLabel,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { DashboardService } from "../../services/DashboardService";
import React from "react";

export default function ApproveModal(props) {
  console.log(props);
  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton
            color="danger"
            onClick={props.handleClose}
            className="ion-padding-start ion-float-left"
          >
            X
          </IonButton>

          <IonTitle className="ion-padding-top">
            Challenge {props.index + 1}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCardContent>
          {props.image && <img src={props.image} imageViewer></img>}
          <IonTitle className="ion-padding-vertica ion-no-padding">
            {props.clue}
          </IonTitle>

          <p className="ion-padding-top">Answer:</p>
          {props.imageAnswer && <img src={props.imageAnswer} imageViewer></img>}
          {props.freeAnswer && <IonLabel>{props.answer}</IonLabel>}
          <div
            className="ion-margin-top"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <IonButton
              color="tertiary"
              onClick={() => {
                DashboardService.approveAnswer(
                  props.id,
                  props.team,
                  props.finished
                );
                props.handleClose();
              }}
            >
              Approve
            </IonButton>
            <IonButton
              color="danger"
              onClick={() => {
                DashboardService.revokeAnswer(props.id, props.team);
                props.handleClose();
              }}
            >
              X
            </IonButton>
          </div>
        </IonCardContent>
      </IonContent>
    </>
  );
}
