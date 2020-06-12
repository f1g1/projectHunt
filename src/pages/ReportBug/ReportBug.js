import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import React from "react";

export default function ReportBug() {
  return (
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
            Report a bug
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRow></IonRow>
      </IonContent>
    </IonPage>
  );
}
