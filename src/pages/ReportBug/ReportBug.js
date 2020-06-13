import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";

import MiscService from "../../services/MiscService";

export default function ReportBug() {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [showToast1, setShowToast1] = useState();

  const handleSend = () => {
    MiscService.sendBugReport({ email, description });
    setDescription("");
    setEmail("");
    setShowToast1("Bug report has been submitted!");
  };
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
        <IonRow style={{ marginTop: "150px" }}>
          <IonCol offsetXl="4" sizeXl="4">
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                onIonChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol offsetXl="4" sizeXl="4">
            <IonItem>
              <IonLabel position="floating">Describe the problem*</IonLabel>
              <IonTextarea
                rows="5"
                required
                onIonChange={(e) => setDescription(e.target.value)}
                value={description}
              ></IonTextarea>
            </IonItem>
            <IonButton
              shape="round"
              disabled={description === undefined || description.length < 3}
              expand="full"
              onClick={handleSend}
            >
              Send!
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
      <IonToast
        isOpen={showToast1 !== undefined}
        onDidDismiss={() => setShowToast1()}
        message={showToast1}
        duration={1000}
        position="top"
        color="light"
        mode="ios"
      />
    </IonPage>
  );
}
