import {
  IonButton,
  IonCardContent,
  IonImg,
  IonItemDivider,
  IonLabel,
  IonTitle,
} from "@ionic/react";

import { PhotoViewer } from "@ionic-native/photo-viewer";
import React from "react";

export default function SeeClueSucces(props) {
  return (
    <div>
      &nbsp;
      {props.step && (
        <>
          <IonItemDivider />
          <IonCardContent>
            <div className="ion-align-items-center" style={{ width: "100%" }}>
              {props.step.succesResponseImage && (
                <IonImg
                  src={props.step.succesResponseImage}
                  style={{ maxHeight: "400px" }}
                  onClick={() =>
                    PhotoViewer.show(props.step.succesResponseImage)
                  }
                ></IonImg>
              )}
            </div>
            <IonTitle className="ion-padding-vertical ion-no-padding-start">
              <h1>{props.step.succesResponseTitle}</h1>
            </IonTitle>
            <IonLabel className="ionic-padding-top">
              {props.step.succesResponseAdditionalInfo}
            </IonLabel>
          </IonCardContent>
          <IonButton
            shape="round"
            shape="round"
            onClick={props.handleSucces}
            expand="full"
          >
            Ok!
          </IonButton>
        </>
      )}
    </div>
  );
}
