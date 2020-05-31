import { IonCheckbox, IonItem, IonItemDivider, IonLabel } from "@ionic/react";
import React, { useState } from "react";

import { PhotoViewer } from "@ionic-native/photo-viewer";
import SeeClueInput from "./SeeClueInput";

export default function SeeClueChallenge(props) {
  const [shareLocation, setShareLocation] = useState(true);
  return (
    <>
      &nbsp;
      {props.step && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={props.step.image}
              style={{ maxHeight: "400px" }}
              onClick={() => PhotoViewer.show(props.step.image)}
            />
          </div>

          <IonLabel>
            <h2 className="ion-text-wrap ion-padding">{props.step.clue}</h2>
          </IonLabel>

          <IonItemDivider />
          <div>
            <SeeClueInput
              answerType={props.step.answerType}
              {...props}
              shareLocation={shareLocation}
            >
              <IonItem className="ion-margin-bottom ion-no-padding">
                <IonLabel className="ion-padding-start">
                  Share location
                </IonLabel>
                <IonCheckbox
                  onIonChange={(e) => setShareLocation(e.detail.checked)}
                  slot="end"
                  checked={shareLocation}
                />
              </IonItem>
            </SeeClueInput>
            <IonLabel className="ion-text-center">
              <p>
                Tip: by sharing your location you can find hidden challenges!
              </p>
            </IonLabel>
          </div>
        </>
      )}
    </>
  );
}
