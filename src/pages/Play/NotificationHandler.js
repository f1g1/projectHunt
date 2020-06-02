import { IonToast } from "@ionic/react";
import React from "react";

export default function NotificationHandler(props) {
  return (
    <>
      <IonToast
        isOpen={props.showToast1}
        onDidDismiss={() => props.setShowToast1()}
        message={props.showToast1}
        duration={2000}
        position="top"
        color="light"
        mode="ios"
      />
    </>
  );
}
