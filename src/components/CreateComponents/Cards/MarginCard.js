import "./Card.scss";

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import GoogleMap from "google-map-react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";

const LocationMarker = ({ lat, lng }) => (
  <LocationOnRoundedIcon
    style={{
      transform: "translate(-50%, -100%)",
    }}
    className="map-user-image"
    lat={lat}
    lng={lng}
  />
);

export default function MarginCard(props) {
  const [polyline, setpolyline] = useState();
  let k = { lat: props.lat, lng: props.lng };

  useEffect(() => {
    polyline &&
      polyline.setOptions({
        center: { lat: props.lat, lng: props.lng },
        radius: props.radius,
      });
  });
  const initPolyLines = (google) => {
    let ppolyline = new google.maps.Circle({
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0.2,
      center: { lat: props.lat, lng: props.lng },
      radius: props.radius,
    });
    ppolyline.setMap(google.map);
    setpolyline(ppolyline);
  };
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{props.title}</IonCardTitle>
          <IonButton onClick={props.openModal} fill="outline">
            Location
          </IonButton>
        </IonCardHeader>
        <IonCardContent>
          <div style={{ height: "220px" }}>
            <div style={{ height: "100%", width: "100%" }}>
              {props.lat && (
                <GoogleMap
                  bootstrapURLKeys={{
                    key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA",
                  }}
                  defaultCenter={k}
                  center={{ lat: props.lat, lng: props.lng }}
                  defaultZoom={15}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={(x) => initPolyLines(x)}
                >
                  <LocationMarker lat={k.lat} lng={k.lng} />
                </GoogleMap>
              )}
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
}
