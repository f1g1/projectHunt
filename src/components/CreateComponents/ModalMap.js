import "./ModalMap.scss";

import {
  IonButton,
  IonCard,
  IonCol,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonRange,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import GoogleMap from "google-map-react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import LocationSearchingRoundedIcon from "@material-ui/icons/LocationSearchingRounded";
import { mapStyle } from "../../resources/mapStyle";

let Marker = (lat, lng) => (
  <div lat={lat} lng={lng} hover="false">
    <LocationOnRoundedIcon
      name="pin"
      className="locationPin "
    ></LocationOnRoundedIcon>
  </div>
);

let ModalMap = (props) => {
  const [google, setGoogle] = useState();
  const [positionSelected, setpositionSelected] = useState();
  const [polyline, setpolyline] = useState();
  const [selectedPosition, setSelectedPosition] = useState({
    lat: props.location.latitude || 0,
    lng: props.location.longitude || 0,
  });
  const [radius, setRadius] = useState(props.raidus || 100);
  let refMap = useRef(null);

  const handleGetCenter = () => {
    let center = google.map.getCenter();
    setSelectedPosition({ lat: center.lat(), lng: center.lng() });
  };
  useEffect(() => {
    if (polyline && selectedPosition) {
      polyline.setOptions({ center: selectedPosition, radius });
    }
    google &&
      google.map.setCenter(
        new google.maps.LatLng(selectedPosition.lat, selectedPosition.lng)
      );
    positionSelected !== undefined
      ? setpositionSelected(true)
      : setpositionSelected(false); 
  }, [selectedPosition, radius]);

  const initPolyLines = (google) => {
    setGoogle(google);
    if (!props.noRadius) {
      let ppolyline = new google.maps.Circle({
        strokeOpacity: 0.3,
        strokeWeight: 1,
        fillOpacity: 0.2,
        radius,
      });
      ppolyline.setMap(google.map);
      setpolyline(ppolyline);
    }
  };
  const mapOptions = {
    styles: mapStyle,
  };
  return (
    <>
      <IonHeader>
        <IonRow>
          <IonCol>
            <IonButton
              shape="round"
              shape="round"
              color="danger"
              onClick={props.handleClose}
            >
              X
            </IonButton>
          </IonCol>

          <IonCol size="5">
            <IonItem lines="none">
              <IonLabel>latitude:</IonLabel>
              <IonInput
                placeholder="lat:"
                value={selectedPosition ? selectedPosition.lat : ""}
                onIonChange={(e) => {
                  if (
                    selectedPosition &&
                    e.target.value !== selectedPosition.lat
                  )
                    selectedPosition &&
                      setSelectedPosition({
                        ...selectedPosition,
                        lat: e.target.value,
                      });
                }}
              ></IonInput>
            </IonItem>
          </IonCol>

          <IonCol size="5">
            <IonItem lines="none">
              <IonLabel>longitude:</IonLabel>
              <IonInput
                placeholder="lng:"
                value={selectedPosition ? selectedPosition.lng : ""}
                onIonChange={(e) => {
                  if (e.target.value !== selectedPosition.lng)
                    selectedPosition &&
                      setSelectedPosition({
                        ...selectedPosition,
                        lng: e.target.value,
                      });
                }}
              >
                {" "}
              </IonInput>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonHeader>
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMap
          options={mapOptions}
          ref={refMap}
          bootstrapURLKeys={{
            key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA",
          }}
          onChange={(x) => console.log(x)}
          defaultCenter={{
            lat: props.location.latitude || 0,
            lng: props.location.longitude || 0,
          }}
          defaultZoom={11}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={(x) => initPolyLines(x)}
        >
          {selectedPosition && (
            <Marker lat={selectedPosition.lat} lng={selectedPosition.lng} />
          )}
        </GoogleMap>
        {!positionSelected && (
          <div hover="false">
            <LocationSearchingRoundedIcon className="locationCrosshair iconSize markerFixed"></LocationSearchingRoundedIcon>
          </div>
        )}
      </div>
      <div className="bottomContainer">
        <IonCard color="light">
          <IonRow>
            {positionSelected ? (
              <>
                {!props.noRadius && (
                  <IonCol className="vcentered">
                    <IonRange
                      min="100"
                      color="primary"
                      pin={true}
                      value={radius}
                      max="2000"
                      onIonChange={(x) => setRadius(x.detail.value)}
                    />
                  </IonCol>
                )}
                <IonCol size="12" className="ion-justify-content-between">
                  <IonButton
                    shape="round"
                    color="success"
                    onClick={() => {
                      props.save(
                        Number(selectedPosition.lat),
                        Number(selectedPosition.lng),
                        radius
                      );
                      props.handleClose();
                    }}
                  >
                    Save
                  </IonButton>
                  <IonButton
                    shape="round"
                    shape="round"
                    color="danger"
                    onClick={props.handleClose}
                  >
                    X
                  </IonButton>
                </IonCol>
              </>
            ) : (
              <IonCol>
                <div className="ion-justify-content-between">
                  <IonButton
                    shape="round"
                    shape="round"
                    shape="round"
                    onClick={handleGetCenter}
                  >
                    Select Position
                  </IonButton>
                </div>
              </IonCol>
            )}
          </IonRow>
        </IonCard>
      </div>
    </>
  );
};

export default ModalMap;
