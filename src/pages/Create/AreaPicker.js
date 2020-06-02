import React, { useState } from "react";

import GoogleMap from "google-map-react";
import { IonButton } from "@ionic/react";

export default function AreaPicker(props) {
  const [shape, setShape] = useState();
  const [line, setLine] = useState();
  const [bounds, setBounds] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState();
  const [modifyingArea, setModifyingArea] = useState(-1);
  const [modifyingBreadcrumbs, setModifyingBreadcrumbs] = useState(-1);

  const handleArea = () => {
    let initialBounds = [
      {
        lat: props.geolocation.latitude + 0.01,
        lng: props.geolocation.longitude + 0.01,
      },
      {
        lat: props.geolocation.latitude + 0.01,
        lng: props.geolocation.longitude - 0.01,
      },
      {
        lat: props.geolocation.latitude - 0.01,
        lng: props.geolocation.longitude - 0.01,
      },
      {
        lat: props.geolocation.latitude - 0.01,
        lng: props.geolocation.longitude + 0.01,
      },
    ];

    let auxBounds = props.bounds ? props.bounds : initialBounds;
    setModifyingArea(true);
    shape.setOptions({ path: auxBounds, editable: true });
    setBounds(auxBounds);
  };

  const handleBreadcrumbs = () => {
    let initialBounds = [
      {
        lat: props.geolocation.latitude + 0.01,
        lng: props.geolocation.longitude,
      },
      {
        lat: props.geolocation.latitude - 0.01,
        lng: props.geolocation.longitude,
      },
    ];

    let auxBreadcrumbs = props.breadcrumbs ? props.breadcrumbs : initialBounds;
    setModifyingBreadcrumbs(true);
    line.setOptions({ path: auxBreadcrumbs, editable: true });
    setBreadcrumbs(auxBreadcrumbs);
  };

  const initShape = (google) => {
    var shape = new google.maps.Polygon({
      path: bounds,
      geodesic: true,
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: "#42656e",
      fillOpacity: 0.3,
    });
    shape.setMap(google.map);
    setShape(shape);
  };

  const initLine = (google) => {
    var line = new google.maps.Polyline({
      path: breadcrumbs,
      geodesic: true,
      strokeOpacity: 1,
      strokeWeight: 2,
      strokeColor: "#ff6600",
    });
    line.setMap(google.map);
    setLine(line);
  };

  const saveArea = () => {
    setModifyingArea(false);
    var polygonBounds = shape.getPath();
    shape.setOptions({ editable: false });
    var auxBounds = [];
    for (var i = 0; i < polygonBounds.length; i++) {
      var point = {
        lat: polygonBounds.getAt(i).lat(),
        lng: polygonBounds.getAt(i).lng(),
      };
      auxBounds.push(point);
    }
    props.setBounds(auxBounds);
  };
  const changeArea = () => {
    if (modifyingArea === -1) {
      handleArea();
    }
    shape.setOptions({ editable: true });
    setModifyingArea(true);
  };

  const changeBreadcrumbs = () => {
    if (modifyingBreadcrumbs === -1) {
      handleBreadcrumbs();
    }
    line.setOptions({ editable: true });
    setModifyingBreadcrumbs(true);
  };

  const saveBreadcrumbs = () => {
    setModifyingBreadcrumbs(false);
    var polygonBounds = line.getPath();
    line.setOptions({ editable: false });
    var auxBreadcrumbs = [];
    for (var i = 0; i < polygonBounds.length; i++) {
      var point = {
        lat: polygonBounds.getAt(i).lat(),
        lng: polygonBounds.getAt(i).lng(),
      };
      auxBreadcrumbs.push(point);
    }
    props.setBreadcrumbs(auxBreadcrumbs);
  };

  return (
    <>
      <div>
        <div style={{ height: "300px", width: "100%" }}>
          <GoogleMap
            bootstrapURLKeys={{
              key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA",
            }}
            defaultCenter={{
              lat: props.geolocation.latitude,
              lng: props.geolocation.longitude,
            }}
            defaultZoom={15}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={(x) => {
              initShape(x);
              initLine(x);
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "10px",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {!modifyingArea || modifyingArea === -1 ? (
              <IonButton onClick={changeArea} color="primary">
                Area
              </IonButton>
            ) : (
              <IonButton onClick={saveArea} color="success">
                Save Area!
              </IonButton>
            )}
            {!modifyingBreadcrumbs || modifyingBreadcrumbs === -1 ? (
              <IonButton onClick={changeBreadcrumbs} color="primary">
                Breadcrumbs
              </IonButton>
            ) : (
              <IonButton onClick={saveBreadcrumbs} color="success">
                Save Breadcrumbs!
              </IonButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
