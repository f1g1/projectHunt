import React from "react";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
} from "@ionic/react";
import GoogleMap from 'google-map-react';
import "./Card.scss";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";

const LocationMarker = ({ lat, lng }) => (
  <LocationOnRoundedIcon style={{
    transform: 'translate(-50%, -100%)'
  }} className="map-user-image" lat={lat} lng={lng} />
);

export default function Card(props) {
  console.log(props.lat, props.lng)
  let k = { lat: props.lat, lng: props.lng }
  const initPolyLines = (google) => {
    let ppolyline = new google.maps.Circle({//<--note the this
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0.2,
      center: { lat: props.lat, lng: props.lng },
      radius: 100

    });
    ppolyline.setMap(google.map);
  }
  return (
    <IonItem lines="none">
      <div style={{ height: '100%', width: '100%' }}>
        <IonCard color="secondary">
          <IonCardHeader>
            <IonCardSubtitle>{props.title}</IonCardSubtitle>
            <IonButton onClick={props.openModal}>Modal</IonButton>
          </IonCardHeader>

          <IonCardContent>
            <div style={{ height: "300px" }}>

              <div style={{ height: '100%', width: '100%' }}>

                {props.lat && <GoogleMap
                  bootstrapURLKeys={{ key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA" }}
                  defaultCenter={k}
                  defaultZoom={15}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={x => initPolyLines(x)}
                >
                  <LocationMarker
                    lat={k.lat}
                    lng={k.lng}
                  />
                </GoogleMap>}
              </div>
            </div>
          </IonCardContent>
        </IonCard ></div>
    </IonItem>
  );
}