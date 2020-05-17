import "./ModalMap.scss";

import {
  IonButton,
  IonCard,
  IonCol,
  IonHeader,
  IonInput,
  IonRange,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import GoogleMap from "google-map-react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import LocationSearchingRoundedIcon from "@material-ui/icons/LocationSearchingRounded";

let Marker = (lat, lng) => (
  <div lat={lat} lng={lng} hover="false">
    <LocationOnRoundedIcon
      name="pin"
      className="locationPin "
    ></LocationOnRoundedIcon>
  </div>
);

let ModalMap = (props) => {
  const [mapCenter, setMapCenter] = useState();
  const [positionSelected, setpositionSelected] = useState(false);
  const [polyline, setpolyline] = useState();
  const [selectedPosition, setSelectedPosition] = useState();
  const [radius, setRadius] = useState(100);
  let refMap = useRef(null);

  const handleGetCenter = () => {
    setSelectedPosition(mapCenter);
    setpositionSelected(true);
  };

  useEffect(() => {
    //changePolyLines
    console.log(radius);
    if (polyline && selectedPosition) {
      polyline.setOptions({ center: selectedPosition, radius });
    }
  }, [selectedPosition, radius]);

  const initPolyLines = (google) => {
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

  return (
    <>
      <IonHeader>
        <IonRow>
          <IonCol size="5">
            <IonInput
              placeholder="lat:"
              value={selectedPosition ? selectedPosition.lat : ""}
              onChange={(e) => {
                if (selectedPosition && e.target.value !== selectedPosition.lat)
                  selectedPosition &&
                    setSelectedPosition({
                      ...selectedPosition,
                      lat: e.target.value,
                    });
              }}
            ></IonInput>
          </IonCol>

          <IonCol align-self-center>/</IonCol>
          <IonCol size="5">
            <IonInput
              placeholder="lng:"
              value={selectedPosition ? selectedPosition.lng : ""}
              onChange={(e) => {
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
          </IonCol>
        </IonRow>
      </IonHeader>
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMap
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
          onDragsStart={(map) => {
            setMapCenter({
              lat: map.getCenter().lat(),
              lng: map.getCenter().lng(),
            });
            setpositionSelected(false);
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={(x) => initPolyLines(x)}
          onDragEnd={(map) => {
            setMapCenter({
              lat: map.getCenter().lat(),
              lng: map.getCenter().lng(),
            });
            setpositionSelected(false);
          }}
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
                    color="success"
                    onClick={() => {
                      props.save(mapCenter.lat, mapCenter.lng, radius);
                      props.handleClose();
                    }}
                  >
                    Save
                  </IonButton>
                  <IonButton color="danger" onClick={props.handleClose}>
                    X
                  </IonButton>
                </IonCol>
              </>
            ) : (
              <IonCol>
                <div className="ion-justify-content-between">
                  <IonButton onClick={handleGetCenter}>
                    Select Position
                  </IonButton>
                  <IonButton color="danger" onClick={props.handleClose}>
                    X
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
