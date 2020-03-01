import React, { useState, useEffect, useRef} from "react";
import { IonHeader, IonContent, IonButton, IonInput, IonRow, IonCol, IonRange, IonGrid, IonCard } from '@ionic/react';
import GoogleMapReact from 'google-map-react';
import "./ModalMap.scss"

let ModalMap = (props) => {
  const [actualCenter, setActualCenter] = useState()
  const [positionSelected, setpositionSelected] = useState(true)
  const [center, setCenter] = useState()
  let refMap = useRef(null);


  const handleGetCenter = () => {
    console.log(props.location);
    setCenter(actualCenter);
    setpositionSelected(true);
  }
  useEffect(() => {
    console.log("default")
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
          defaultCenter={{ lat: 0, lng: 0 }}
          defaultZoom={11}
          onDragsStart={(map) => { setActualCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() }); setpositionSelected(false) }}

          onDragEnd={(map) => { setActualCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() }); setpositionSelected(false) }}
        >
          {center && <div lat={center.lat} lng={center.lng}  ><ion-icon color="primary" name="pin" className="locationPin iconSize" ></ion-icon></div>}
        </GoogleMapReact>

        {!positionSelected && <div className="markerFixed" color="danger"><ion-icon name="locate" className="locationCrosshair iconSize" color="secondary"></ion-icon></div>}
      </div>
      <div className='bottomContainer'>
        <IonCard color="light">
          <IonGrid>
            {positionSelected && <IonRow>
              <IonCol size="8">
                <IonRange color="primary" pin={true} />

              </IonCol>
              <IonCol className="vcentered">
                <IonButton onClick={() => {
                  props.save(actualCenter.lat, actualCenter.lng);
                  props.handleClose()
                }

                }>
                  <ion-icon name="checkmark"></ion-icon>

                </IonButton>
              </IonCol>
            </IonRow>}
            <IonRow>
              <IonCol size="3">  <IonButton color="danger" onClick={props.handleClose} >
                X
        </IonButton >

              </IonCol>
              <IonCol size="9">
                <IonButton onClick={handleGetCenter} color="secondary">Select Position</IonButton>

              </IonCol>
              <IonCol>

              </IonCol>
            </IonRow>

          </IonGrid>
        </IonCard>
      </div>
    </IonContent>
  </>
}

export default ModalMap;
