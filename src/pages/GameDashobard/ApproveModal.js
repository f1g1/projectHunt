import {
  IonButton,
  IonButtons,
  IonCardContent,
  IonContent,
  IonHeader,
  IonLabel,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import CloseIcon from "@material-ui/icons/Close";
import { DashboardService } from "../../services/DashboardService";
import React from "react";

export default function ApproveModal(props) {
  console.log(props);
  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          {/* <IonButton
            shape="round"
            color="danger"
            onClick={props.handleClose}
            className="ion-padding-start ion-float-left"
          >
            X
          </IonButton> */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <IonButtons style={{ display: "inline-block" }}>
              <IonButton shape="round" onclick={props.handleClose}>
                <CloseIcon />
              </IonButton>
            </IonButtons>
            <IonTitle style={{ display: "inline-block" }}>
              Challenge {props.index + 1}
            </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCardContent>
          {props.image && <img src={props.image} imageViewer></img>}
          <div className="ion-padding-vertical ion-no-padding">
            Clue:
            <IonLabel className="ion-text-wrap">
              <h2 style={{ fontWeight: "bold" }}>{props.clue}</h2>
            </IonLabel>
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
              shape="round"
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
                shape="round"
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
