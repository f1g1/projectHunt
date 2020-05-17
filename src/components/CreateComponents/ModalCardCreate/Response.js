import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import React, { useRef, useState } from "react";

export default function Response(props) {
  const refSuccesInput = useRef();
  const refWrongInput = useRef();
  const [loadingImage, setLoadingImage] = useState(false);

  const onChooseSuccesPhoto = (event, succes) => {
    debugger;
    if (event.target.files && event.target.files[0]) {
      setLoadingImage(true);
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        if (succes)
          props.setStep({
            ...props.step,
            succesResponseImage: URL.createObjectURL(event.target.files[0]),
            succesResponseImageFile: event.target.files[0],
          });
        else
          props.setStep({
            ...props.step,
            wrongResponseImage: URL.createObjectURL(event.target.files[0]),
            wrongResponseImageFile: event.target.files[0],
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
    <>
      <IonRow className="ion-no-padding ion-no-margin">
        <IonCol className="ion-no-padding ion-no-margin">
          <IonCard
            style={{ margin: "15px 0px" }}
            className="ion-no-padding ion-no-margin ion-padding-vertical"
          >
            <IonCardContent color="primary">
              <IonCardTitle>Correct Answer:</IonCardTitle>
              {props.step.succesResponseImage && (
                <img
                  className="ion-justify-content-center ion-align-self-center"
                  src={props.step.succesResponseImage}
                />
              )}
              <IonButton full onClick={() => refSuccesInput.current.click()}>
                Add Photo
              </IonButton>
              <input
                ref={refSuccesInput}
                accept="image/*"
                className="viewInputGallery"
                type="file"
                onChange={(e) => onChooseSuccesPhoto(e, true)}
              />
              <IonItem>
                <IonLabel position="floating">Title:</IonLabel>
                <IonInput
                  onIonChange={(e) => {
                    props.setStep({
                      ...props.step,
                      succesResponseTitle: e.target.value,
                    });
                  }}
                  maxlength="50"
                  value={props.step.succesResponseTitle}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Info:</IonLabel>
                <IonTextarea
                  onIonChange={(e) => {
                    props.setStep({
                      ...props.step,
                      succesResponseAdditionalInfo: e.target.value,
                    });
                  }}
                  value={props.step.succesResponseAdditionalInfo}
                  maxlength="500"
                ></IonTextarea>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <IonCard color="danger" className="ion-no-padding ion-no-margin">
            <IonCardContent>
              <IonCardTitle>Wrong Answer:</IonCardTitle>
              {props.step.wrongResponseImage && (
                <img
                  className="ion-justify-content-center ion-align-self-center"
                  src={props.step.wrongResponseImage}
                />
              )}
              <IonButton
                color="light"
                full
                onClick={() => refWrongInput.current.click()}
              >
                Add Photo
              </IonButton>
              <input
                ref={refWrongInput}
                accept="image/*"
                className="viewInputGallery"
                type="file"
                onChange={(e) => onChooseSuccesPhoto(e, false)}
              />
              <IonItem color="danger">
                <IonLabel position="floating">Title:</IonLabel>
                <IonInput
                  onIonChange={(e) => {
                    props.setStep({
                      ...props.step,
                      wrongResponseTitle: e.target.value,
                    });
                  }}
                  maxlength="50"
                  value={props.step.wrongResponseTitle}
                ></IonInput>
              </IonItem>
              <IonItem color="danger">
                <IonLabel position="floating">Info:</IonLabel>
                <IonTextarea
                  onIonChange={(e) => {
                    props.setStep({
                      ...props.step,
                      wrongResponseAdditionalInfo: e.target.value,
                    });
                  }}
                  maxlength="500"
                  value={props.step.wrongResponseAdditionalInfo}
                ></IonTextarea>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </>
  );
}
