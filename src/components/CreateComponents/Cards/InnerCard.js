import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItemOptions,
  IonItemOption,
  IonButton,
} from "@ionic/react";
export default function InnerCard(props) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <IonCard color="light" className="full">
        <IonCardHeader>
          <IonButton className="toRight" color="danger">x</IonButton>
        </IonCardHeader>
        <IonCardContent>
          {props.children[0]}
          <img src={props.image} height="300px" width="auto"></img>
          <br />
          <IonCardTitle>{props.clue}</IonCardTitle>
          <br></br>
        Code:<IonCardSubtitle>{props.code}</IonCardSubtitle>
          {props.children[1]}
        </IonCardContent>
      </IonCard>
    </div>
  );
}