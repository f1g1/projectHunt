import React from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel
} from "@ionic/react";
import "./MarginCard.scss";
import MapWithLocation from "../../Map/Map";
export default function Card(props) {
  return (
    <IonCard color="secondary">
      <IonCardHeader>
        <IonCardSubtitle>{props.title}</IonCardSubtitle>
        <IonButton onClick={props.openModal}>Modal</IonButton>
      </IonCardHeader>
      {props.lat && props.lng && (
        <div className="mapContainer">
          <MapWithLocation
            coords={{ lat: props.lat, lng: props.lng }}
          ></MapWithLocation>
        </div>
      )}
    </IonCard>
  );
}
