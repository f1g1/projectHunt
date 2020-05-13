import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonItem,
  IonLabel,
  IonModal,
  IonRange,
  IonRow,
} from "@ionic/react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import GoogleMap from "google-map-react";
import React, { useEffect, useState } from "react";
import MiscService from "../../../services/MiscService";
import ModalMap from "../ModalMap";

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

export default function Misc(props) {
  const [location, setLocation] = useState();
  const [showMapModal, setShowMapModal] = useState(false);

  const [polyline, setpolyline] = useState();

  useEffect(() => {
    MiscService.getCachedGeolocation().then((x) => setLocation(x));
  }, []);
  useEffect(() => {
    polyline &&
      polyline.setOptions({
        center: props.step.coords,
        radius: props.step.radius,
      });
    console.log(props.step);
  });
  const initPolyLines = (google) => {
    let ppolyline = new google.maps.Circle({
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0.2,
      center: props.step.coords,
      radius: props.step.radius,
    });
    ppolyline.setMap(google.map);
    setpolyline(ppolyline);
  };
  const handleCloseMap = () => {
    setShowMapModal(false);
  };
  const saveLocation = (lat, lng, radius) => {
    props.setStep({ ...props.step, coords: { lat, lng }, radius });
  };
  return (
    <>
      <IonButton onClick={() => setShowMapModal(true)} fill="outline">
        Location
      </IonButton>
      <IonItem>
        <IonLabel>Points: {props.step.points && props.step.points}</IonLabel>
        <IonRange
          min="100"
          max="2000"
          step="10"
          pin={true}
          value={props.step.points}
          onIonChange={(x) =>
            props.setStep({ ...props.step, points: x.detail.value })
          }
        />
      </IonItem>
      <IonItem lines="none">
        <IonLabel>Hidden</IonLabel>
        <IonCheckbox
          className="ion-no-padding"
          disabled={props.step.visible}
          value={props.step.hidden}
          onIonChange={(x) =>
            props.setStep({ ...props.step, hidden: x.detail.checked })
          }
        />
      </IonItem>
      <IonItem className="ion-no-padding">
        <p
          style={{ fontSize: "small", opacity: 0.5 }}
          className="ion-margin-start"
        >
          Hidden means that this challenge will be visible only if player checks
          in in the specified area
        </p>
      </IonItem>
      <IonItem lines="none">
        <IonLabel>Visible</IonLabel>
        <IonCheckbox
          className="ion-no-padding"
          disabled={props.step.hidden}
          value={props.step.visible}
          onIonChange={(x) =>
            props.setStep({ ...props.step, visible: x.detail.checked })
          }
        />
      </IonItem>
      <IonItem className="ion-no-padding">
        <p
          style={{ fontSize: "small", opacity: 0.5 }}
          className="ion-margin-start"
        >
          Visible means that this challenge will be visible on the game map, and
          will see the specified area where he can find what he is looking for
        </p>
      </IonItem>
      <IonRow>
        <IonCol>
          {props.step.coords && (
            <div style={{ height: "250px" }}>
              <div style={{ height: "100%", width: "100%" }}>
                <GoogleMap
                  bootstrapURLKeys={{
                    key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA",
                  }}
                  defaultCenter={props.step.coords}
                  center={props.step.coords}
                  defaultZoom={15}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={(x) => initPolyLines(x)}
                >
                  <LocationMarker {...props.step.coords} />
                </GoogleMap>
              </div>
            </div>
          )}
        </IonCol>
      </IonRow>
      <div className="ion-padding-top">
        {(props.step.hidden || props.step.visible) && !props.step.coords && (
          <IonLabel color="danger" className="ion-text-center">
            <p>You need to specify location, if hidden or visible</p>
          </IonLabel>
        )}
      </div>
      <IonModal
        isOpen={showMapModal}
        onDidDismiss={() => handleCloseMap(false)}
      >
        <ModalMap
          save={saveLocation}
          handleClose={() => handleCloseMap(false)}
          location={location}
        ></ModalMap>
      </IonModal>
    </>
  );
}
