import {
  IonButton,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";
import React, { useRef, useState } from "react";

import ChallengeInput from "./ChallengeInput";

export default function Challenge(props) {
  const [loadingImage, setLoadingImage] = useState(false);
  const refInput = useRef();
  const onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLoadingImage(true);
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        props.setStep({
          ...props.step,
          image: URL.createObjectURL(event.target.files[0]),
          imageFile: event.target.files[0],
        });
      } else {
        setLoadingImage(false);
        console.log("This file is not an image");
      }
    } else {
      setLoadingImage(false);
    }
  };
  return (
    <IonList>
      {props.step.image && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={props.step.image}
            style={{ maxHeight: "500px" }}
            className="ion-padding-vertical"
          />
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <IonButton shape="round" onClick={() => refInput.current.click()}>
          Add Photo
        </IonButton>
      </div>
      <input
        ref={refInput}
        accept="image/*"
        className="viewInputGallery"
        type="file"
        onChange={onChoosePhoto}
      />{" "}
      <IonItemDivider />
      <IonItem>
        <IonLabel position="stacked">Clue</IonLabel>
        <IonTextarea
          onIonChange={(e) =>
            props.setStep({ ...props.step, clue: e.target.value })
          }
          value={props.step.clue}
          maxlength="500"
        ></IonTextarea>
      </IonItem>
      <IonItem>
        <IonLabel>Answer Type:</IonLabel>
        <IonSelect
          interface="popover"
          value={props.step.answerType}
          onIonChange={(e) =>
            props.setStep({ ...props.step, answerType: e.target.value })
          }
          placeholder="Choose answer type"
        >
          <IonSelectOption value={0}>Text</IonSelectOption>
          <IonSelectOption value={1}>QR</IonSelectOption>
          <IonSelectOption value={2}>Photo</IonSelectOption>
        </IonSelect>
      </IonItem>
      <ChallengeInput {...props} />
    </IonList>
  );
}
