import React, { useState, useEffect, useRef, Children } from "react";
import { IonHeader, IonContent, IonButton, IonInput, IonRow, IonCol, IonRange, IonGrid, IonCard } from '@ionic/react';
import GoogleMap from 'google-map-react';
import "./ModalMap.scss"
import AddLocationIcon from '@material-ui/icons/AddLocation';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

let ModalMap = (props) => {
  const [actualCenter, setActualCenter] = useState()
  const [positionSelected, setpositionSelected] = useState(true)
  const [polyline, setpolyline] = useState()
  const [center, setCenter] = useState()
  const [range, setRange] = useState(1)
  let refMap = useRef(null);

  const handleGetCenter = () => {
    console.log(props.location);
    setCenter(actualCenter);
    setpositionSelected(true);
  }
  useEffect(() => {
    console.log("default")
  }, [])

  useEffect(() => {
    //changePolyLines
    console.log("actual??")
    if (polyline && actualCenter) {
      console.log("center", actualCenter)
      polyline.setOptions({ fillColor: '#0000FF', center: actualCenter });
    }
  }, [actualCenter])


  const initPolyLines = (google) => {
    console.log("actual", actualCenter)
    let ppolyline = new google.maps.Circle({//<--note the this
      strokeColor: '#FF0000',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 1,
      center: { lat: 45.301281341625064, lng: 28.15425781525737 },
      radius: 100
    });
    ppolyline.setMap(google.map);
    setpolyline(ppolyline)
  }


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
        <GoogleMap
          ref={refMap}
          bootstrapURLKeys={{
            key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA"
          }}
          onChange={x => console.log(x)}
          defaultCenter={{ lat: props.location.latitude, lng: props.location.longitude }}
          defaultZoom={11}
          onDragsStart={(map) => { setActualCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() }); setpositionSelected(false) }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={x => initPolyLines(x)}
          onDragEnd={(map) => { setActualCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() }); setpositionSelected(false) }}
        >
          {center && <div lat={center.lat} lng={center.lng} hover="false"><AddLocationIcon name="pin" className="locationPin " ></AddLocationIcon></div>}
        </GoogleMap>

        {!positionSelected && <div hover="false"><LocationSearchingIcon className="locationCrosshair iconSize markerFixed" ></LocationSearchingIcon></div>}
      </div>
      <div className='bottomContainer'>
        <IonCard color="light">
          <IonGrid>
            {positionSelected && <IonRow>
              <IonCol size="8">
                <IonRange color="primary" pin={true} value={range} onIonChange={x => setRange(x.detail.value)} />

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
