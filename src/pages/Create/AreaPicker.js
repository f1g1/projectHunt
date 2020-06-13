import React, { useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import GoogleMap from "google-map-react";
import { IonButton } from "@ionic/react";
import { mapStyle } from "../../resources/mapStyle";

const CenterMapMarker = ({ lat, lng }) => (
  <>
    <div className="labelLocation">Center</div>
    <CloseIcon className="map-user-to-share" lat={lat} lng={lng} />
  </>
);

export default function AreaPicker(props) {
  const [shape, setShape] = useState();
  const [line, setLine] = useState();
  const [bounds, setBounds] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
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
    var lineSymbol = {
      path: "M 0,-1 0,1",
      strokeOpacity: 1,
      scale: 2,
      fill: "#2d545e",
    };
    var line = new google.maps.Polyline({
      path: breadcrumbs,
      geodesic: true,
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: "0",
          repeat: "20px",
          fill: "#2d545e",
        },
      ],
    });
    line.setMap(google.map);
    setLine(line);
  };
  const handleRecenter = () => {
    let center = shape.getMap().getCenter();
    line.setOptions({ path: [], editable: false });
    shape.setOptions({ path: [], editable: false });
    saveBreadcrumbs();
    saveArea();
    props.handleRecenter({ latitude: center.lat(), longitude: center.lng() });
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
    handleArea();
    shape.setOptions({ editable: true });
    setModifyingArea(true);
  };

  const changeBreadcrumbs = () => {
    handleBreadcrumbs();
    line.setOptions({ editable: true, strokeOpacity: 1 });
    setModifyingBreadcrumbs(true);
  };

  const saveBreadcrumbs = () => {
    setModifyingBreadcrumbs(false);
    var polygonBounds = line.getPath();
    line.setOptions({ editable: false, strokeOpacity: 0 });
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
  const mapOptions = {
    styles: mapStyle,
  };

  return (
    <>
      <div>
        <div style={{ height: "300px", width: "100%" }}>
          <GoogleMap
            options={mapOptions}
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
          >
            <CenterMapMarker
              lat={props.geolocation.latitude}
              lng={props.geolocation.longitude}
            ></CenterMapMarker>
          </GoogleMap>

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
              <IonButton
                shape="round"
                shape="round"
                shape="round"
                onClick={changeArea}
                color="primary"
              >
                Area
              </IonButton>
            ) : (
              <IonButton
                shape="round"
                shape="round"
                shape="round"
                onClick={saveArea}
                color="success"
              >
                Save Area!
              </IonButton>
            )}
            <IonButton shape="round" shape="round" onClick={handleRecenter}>
              Recenter
            </IonButton>
            {!modifyingBreadcrumbs || modifyingBreadcrumbs === -1 ? (
              <IonButton
                shape="round"
                shape="round"
                onClick={changeBreadcrumbs}
                color="primary"
              >
                Breadcrumbs
              </IonButton>
            ) : (
              <IonButton
                shape="round"
                shape="round"
                onClick={saveBreadcrumbs}
                color="success"
              >
                Save Breadcrumbs!
              </IonButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
