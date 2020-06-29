import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItemDivider,
  IonLabel,
  IonLoading,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import MiscService from "../../services/MiscService";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function JoinQrModal(props) {
  const [qr, setQr] = useState();
  const [setted, setsetted] = useState(false);

  useEffect(() => {
    MiscService.getQr(props.entryCode).then((x) => {
      setQr(x.url);
    });
    sleep(2000).then(setsetted(true));
  }, []);

  return !setted ? (
    <IonLoading isOpen={!qr} message={"Loading QR..."} duration={2000} />
  ) : (
    <>
      <IonHeader>
        <IonToolbar color="primary" className="ion-text-center">
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <IonButton
            shape="round"
            color="danger"
            onClick={props.handleClose}
            className="ion-padding-start ion-float-left"
          >
            X
          </IonButton> */}
            <IonButtons style={{ display: "inline-block" }}>
              <IonButton shape="round" onclick={props.handleClose}>
                <CloseIcon />
              </IonButton>
            </IonButtons>
          </div>
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
          <IonLabel className="ion-padding-top">
            <h1>Scan this code to join</h1>
          </IonLabel>
          <img width="70%" height="auto" src={qr} />
          <IonLabel className="ion-padding-vertical">
            <IonItemDivider />
            <h2>Code:{props.entryCode} </h2>
          </IonLabel>
        </div>
      </IonContent>
    </>
  );
}
