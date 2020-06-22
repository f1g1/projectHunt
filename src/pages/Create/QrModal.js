import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import React from "react";

export default function QrModal(props) {
  return (
    <IonContent>
      <IonHeader>
        <IonToolbar color="primary" className="ion-text-center">
          <div className="ion-padding-left">
            <IonButton
              shape="round"
              color="danger"
              onClick={props.handleClose}
              className="ion-float-left"
            >
              X
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonList>
        <IonListHeader>
          <IonTitle
            className="ion-padding-vertical ion-margin-top ion-no-padding"
            style={{ textAlign: "center" }}
          >
            {props.steps.length > 0
              ? "Qrs needed for the challenges"
              : "You didn't set any challenge that requires a QR code"}
          </IonTitle>
        </IonListHeader>
        {props.steps.map((step) => {
          return (
            step.answerType == 1 && (
              <IonItem>
                <IonLabel>Challenge #{step.index + 1}</IonLabel>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500${
                    step.color ? `&color=${step.color}` : ""
                  }&data=${step.code} `}
                  download
                  target="_blank"
                >
                  Open!
                </a>
              </IonItem>
            )
          );
        })}
      </IonList>
    </IonContent>
  );
}
