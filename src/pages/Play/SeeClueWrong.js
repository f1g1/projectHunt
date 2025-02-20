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
import moment from "moment";

export default function SeeClueWrong(props) {
  return (
    <div>
      <>
        <IonTitle className="ion-text-center ion-padding-top">
          {!props.step.onlyOnce &&
            props.timer > 0 &&
            `Remaining penalty time ${moment.utc(props.timer).format("mm:ss")}`}
        </IonTitle>
        <IonItemDivider />

        <IonCardContent>
          <div className="ion-align-items-center" style={{ width: "100%" }}>
            {props.step.wrongResponseImage && (
              <IonImg
                src={props.step.wrongResponseImage}
                style={{ maxHeight: "400px" }}
                onClick={() => PhotoViewer.show(props.step.wrongResponseImage)}
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
          <br />
          {props.timer <= 0 ||
            (!props.timer && (
              <IonButton
                shape="round"
                className="ion-padding-vertical"
                expand="full"
                onClick={props.ok}
              >
                Ok
              </IonButton>
            ))}
        </IonCardContent>
      </>
    </div>
  );
}
