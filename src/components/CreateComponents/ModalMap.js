import React, { useState, useEffect, useRef } from "react";
import { IonHeader, IonContent, IonButton, IonInput, IonRow, IonFooter, IonCol } from '@ionic/react';
import GoogleMapReact from 'google-map-react';
// import "./Map/Map.css"


import "./ModalMap.css"
let ModalMap = (props) => {
  const [actualCenter, setActualCenter] = useState()
  const [center, setCenter] = useState(props.defaultLocation !== undefined ? props.defaultLocation : { lat: 0, lng: 0 })
  const [value, setValue] = useState("");


  let refMap = useRef(null);


  const handleGetCenter = () => {

    setCenter(actualCenter);
  }

  const handleBoundsChanged = () => {
  };

  let defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };


  useEffect(() => {
    setCenter(defaultProps.center)
  }, [])

  return <>


    <IonHeader>
      <IonRow>

        <IonCol size="5">
          <IonInput placeholder="lat:" value={center ? center.lat : ""} onChange={(e) => { if (center && e.target.value !== center.lat) center && setCenter({ ...center, lat: e.target.value }) }}></IonInput>

        </IonCol>

        <IonCol align-self-center>
          /
        </IonCol>
        <IonCol size="5">
          <IonInput placeholder="lng:" value={center ? center.lng : ""} onChange={(e) => { if (e.target.value !== center.lng) center && setCenter({ ...center, lng: e.target.value }) }}> </IonInput>
        </IonCol>

      </IonRow>
    </IonHeader>
    <IonContent>
      <div style={{ height: '100%', width: '100%' }}>
        <GoogleMapReact
          ref={refMap}
          bootstrapURLKeys={{
            key: "AIzaSyAzTj3HlinSmLhPkJWlV1Swo0rEO_MDvoU"
          }}
          onChange={x => console.log(x)}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onDragEnd={(map) => setActualCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() })}
        >
          {center && <div lat={center.lat} lng={center.lng}>V</div>}
        </GoogleMapReact>

        <div className="markerFixed">X</div>
      </div>
      <div className="bottomContainer">
        <IonButton color="danger" onClick={props.handleClose} >
          X
        </IonButton >
        <IonButton onClick={handleGetCenter}>SAVE POSITION</IonButton>
        <IonInput value={value} onChange={e => setValue(e.target.value)}></IonInput>
      </div>
    </IonContent>


  </>
}

export default ModalMap;
