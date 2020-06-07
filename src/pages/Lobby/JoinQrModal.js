import {
  IonButton,
  IonContent,
  IonHeader,
  IonItemDivider,
  IonLoading,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import MiscService from "../../services/MiscService";

export default function JoinQrModal(props) {
  const [qr, setQr] = useState();

  useEffect(() => {
    MiscService.getQr(props.entryCode).then((x) => {
      setQr(x.url);
    });
  }, []);

  return !qr ? (
    <IonLoading isOpen={!qr} message={"Loading QR..."} duration={2000} />
  ) : (
    <>
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
      <IonContent>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IonTitle className="ion-padding-vertical">
            <h1>Scan this code to join</h1>
          </IonTitle>
          <img width="70%" height="auto" src={qr} />
          <IonTitle className="ion-padding-vertical">
            <IonItemDivider />
            <h2>Code:{props.entryCode} </h2>
          </IonTitle>
        </div>
      </IonContent>
    </>
  );
}
