import React, { useState } from "react";
import { IonHeader, IonContent, IonToolbar, IonTitle, IonButton, IonInput, IonRow, IonFooter } from '@ionic/react';
import SimpleMap from "../Map/SimpleMap";

import "./ModalMap.css"
function ModalMap(props) {

  const [value, setValue] = useState("");
  const [center, setCenter] = useState(props.defaultLocation !== undefined ? props.defaultLocation : { lat: 0, lng: 0 })
  const getCenter = (center) => {
    debugger
  }
  console.log(center);

  return <>
    <IonHeader>
      <IonRow>
        <IonInput placeholder="lng" className="inpt" value={center.lat || 0} onChange={(e) => { if (e.target.value !== center.lng) center && setCenter({ ...center, lng: e.target.value }) }}> </IonInput>
        <IonInput placeholder="lat:" className="inpt" value={center.lng || 0} onChange={(e) => { if (center && e.target.value !== center.lat) center && setCenter({ ...center, lat: e.target.value }) }}></IonInput>

      </IonRow>
    </IonHeader>
    <IonContent >

      <SimpleMap getCenter={getCenter} showCenter />
      <div className="bottomContainer">
        <IonButton color="danger" onClick={props.handleClose} >
          X
        </IonButton >
        <IonButton>SAVE POSITION</IonButton>
        <IonInput value={value} onChange={e => setValue(e.target.value)}></IonInput>
      </div>
    </IonContent>

  </>
}

export default ModalMap;
