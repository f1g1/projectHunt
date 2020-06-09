import {
  IonButton,
  IonCardContent,
  IonContent,
  IonHeader,
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
          <div className="ion-padding-vertical ion-no-padding">
            Clue:
            <IonTitle>{props.clue}</IonTitle>
          </div>
          <div className="ion-padding-vertical ion-no-padding">
            Answer:
            <br />
            {props.imageAnswer && (
              <img src={props.imageAnswer} imageViewer></img>
            )}
            {props.freeAnswer && <IonTitle>{props.answer}</IonTitle>}
            <div
              className="ion-margin-top"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            ></div>
            <IonButton
              size="large"
              expand="full"
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
            <div style={{ bottom: "20px" }}>
              <IonButton
                className="ion-padding-vertical"
                expand="full"
                color="danger"
                onClick={() => {
                  DashboardService.revokeAnswer(props.id, props.team);
                  props.handleClose();
                }}
              >
                decline
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonContent>
    </>
  );
}
