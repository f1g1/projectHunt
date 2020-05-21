import {
  IonCardContent,
  IonImg,
  IonItemDivider,
  IonLabel,
  IonTitle,
} from "@ionic/react";

import { PhotoViewer } from "@ionic-native/photo-viewer";
import React from "react";

export default function SeeClueWrong(props) {
  return (
    <div>
      {" "}
      &nbsp;
      {
        <>
          <IonTitle className="ion-text-center ion-padding-top">
            {!props.step.onlyOnce && "Remaining penalty time {props.timer"}
          </IonTitle>
          <IonItemDivider />

          <IonCardContent>
            <div className="ion-align-items-center" style={{ width: "100%" }}>
              {props.step.wrongResponseImage && (
                <IonImg
                  src={props.step.wrongResponseImage}
                  style={{ maxHeight: "400px" }}
                  onClick={() =>
                    PhotoViewer.show(props.step.wrongResponseImage)
                  }
                >
                  {" "}
                </IonImg>
              )}
            </div>
            <IonTitle className="ion-padding-vertical ion-no-padding-start">
              <h1>{props.step.wrongResponseTitle}</h1>
            </IonTitle>
            <IonLabel className="ionic-padding-top">
              {props.step.wrongResponseAdditionalInfo}
            </IonLabel>
          </IonCardContent>
        </>
      }
    </div>
  );
}
