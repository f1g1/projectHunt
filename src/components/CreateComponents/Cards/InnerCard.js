import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
} from "@ionic/react";
export default function InnerCard(props) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <IonCard color="light" className="full">
        <IonCardHeader slot="end">
          <IonButton color="danger" onClick={() => props.delete(props.step.id)}>x</IonButton>
        </IonCardHeader>
        <IonCardContent>
          {props.children[0]}
          {props.step.imageUrl && <img src={props.step.imageUrl} height="auto" width="auto"></img>}
          <br />
          <IonCardTitle>{props.step.clue}</IonCardTitle>
          <br></br>
        Code:<IonCardSubtitle>{props.step.code}</IonCardSubtitle>
          {props.children[1]}
        </IonCardContent>
      </IonCard>
    </div>
  );
}