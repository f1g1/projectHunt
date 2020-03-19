import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
export default function InnerCard(props) {
  return (
    <div style={{ height: '100%', width: '100%' }}>

      <IonCard color="light" className="full">
        <IonCardHeader>
          <MoreVertIcon className="toRight"></MoreVertIcon>
          <br></br>
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