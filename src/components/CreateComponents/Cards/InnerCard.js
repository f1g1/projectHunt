import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";

import React from "react";

export default function InnerCard(props) {

  console.log(props.step);
  return (
    <div style={{ height: '100%', width: '100%' }}>
      {props.step &&
        <IonCard color="light" className="full">
          <IonCardHeader slot="end">
            <IonButton color="danger" onClick={() => props.delete(props.step.id)}>x</IonButton>
            <IonButton onClick={() => { props.edit(props.step) }}>Edit</IonButton>
          </IonCardHeader>
          <IonCardContent>
            {props.children[0]}
            {props.step.image && <img src={props.step.image} height="auto" width="auto"></img>}
            <br />
            <IonCardTitle>{props.step.clue}</IonCardTitle>
            <br></br>
        Code:<IonCardSubtitle>{props.step.code}</IonCardSubtitle>
            {props.children[1]}
          </IonCardContent>
        </IonCard>
      }
    </div>
  );
}