import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonLabel,
  IonRow,
} from "@ionic/react";

import React from "react";

let answerTypes = { 0: "Text", 1: "QR code", 2: "Image" };

export default function InnerCard(props) {
  return (
    // <div style={{ height: "100%", width: "100%" }}>
    <div>
      {props.step && (
        <IonCard color="light" className="full">
          <IonCardHeader slot="end">
            <IonButton
              color="danger"
              onClick={() => props.delete(props.step.id)}
            >
              x
            </IonButton>
            <IonButton
              onClick={() => {
                props.edit(props.step);
              }}
            >
              Edit
            </IonButton>
          </IonCardHeader>
          <IonCardContent>
            {props.children[0]}
            {props.step.image && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={props.step.image}
                  alt="step image"
                  height="auto"
                  width="auto"
                  style={{
                    maxHeight: "200px",
                    maxWidth: "200px",
                  }}
                />
              </div>
            )}
            <br />
            Clue:
            <IonCardTitle>{props.step.clue}</IonCardTitle>
            <br></br>
            <IonRow>
              <IonCol sizeXl="3">
                {(!props.step.freeAnswer || !props.step.answerType === 2) && (
                  <>
                    Code:
                    <IonCardSubtitle>{props.step.code}</IonCardSubtitle>{" "}
                  </>
                )}
              </IonCol>

              <IonCol sizeXl="3">
                Points:
                <IonCardSubtitle>{props.step.points}</IonCardSubtitle>
              </IonCol>
              <IonCol sizeXl="3">
                Type:
                <IonCardSubtitle>
                  {answerTypes[props.step.answerType]}
                </IonCardSubtitle>
              </IonCol>
              <IonCol sizeXl="3">
                Waiting time:
                <IonCardSubtitle>{props.step.waitingTime}s</IonCardSubtitle>
              </IonCol>
            </IonRow>
            {props.step.freeAnswer && (
              <IonLabel color="danger">
                <p>Free answer, requieres admin validation</p>
              </IonLabel>
            )}
            {props.step.answerType === 2 && (
              <IonLabel color="danger">
                <p>Image answer</p>
              </IonLabel>
            )}
            {props.children[1]}
          </IonCardContent>
        </IonCard>
      )}
    </div>
  );
}
