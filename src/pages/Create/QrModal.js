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
          <IonButton
            color="danger"
            onClick={props.handleClose}
            className="ion-padding-start ion-float-left"
          >
            X
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonList>
        <IonListHeader>
          <IonTitle className="ion-padding-vertical ion-margin-top ion-no-padding">
            Qrs needed for the challenges
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
