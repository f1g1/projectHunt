import React, { useState, useEffect, useRef, Children } from "react";
import { IonHeader, IonContent, IonButton, IonInput, IonRow, IonCol, IonRange, IonGrid, IonCard } from '@ionic/react';
import GoogleMap from 'google-map-react';
import "./ModalMap.scss"
import AddLocationIcon from '@material-ui/icons/AddLocation';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

let ModalMap = (props) => {
  const [mapCenter, setMapCenter] = useState()
  const [positionSelected, setpositionSelected] = useState(true)
  const [polyline, setpolyline] = useState()
  const [selectedPosition, setSelectedPosition] = useState()
  const [radius, setRadius] = useState(1)
  let refMap = useRef(null);

  const handleGetCenter = () => {
    console.log(props.location);
    setSelectedPosition(mapCenter);
    setpositionSelected(true);
  }
  useEffect(() => {
    console.log("default")
  }, [])

  useEffect(() => {
    //changePolyLines
    console.log(radius)
    if (polyline && selectedPosition) {
      polyline.setOptions({ center: selectedPosition, radius });
    }
  }, [selectedPosition, radius])


  const initPolyLines = (google) => {
    console.log("actual", mapCenter)
    let ppolyline = new google.maps.Circle({//<--note the this
      // strokeColor: '#FF0000',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      // fillColor: '#FF0000',
      fillOpacity: 0.2,
      radius
    });
    ppolyline.setMap(google.map);
    setpolyline(ppolyline)
  }


  return <>
    <IonHeader>
      <IonRow>

        <IonCol size="5">
          <IonInput placeholder="lat:" value={selectedPosition ? selectedPosition.lat : ""} onChange={(e) => { if (selectedPosition && e.target.value !== selectedPosition.lat) selectedPosition && setSelectedPosition({ ...selectedPosition, lat: e.target.value }) }}></IonInput>

        </IonCol>

        <IonCol align-self-center>
          /
        </IonCol>
        <IonCol size="5">
          <IonInput placeholder="lng:" value={selectedPosition ? selectedPosition.lng : ""} onChange={(e) => { if (e.target.value !== selectedPosition.lng) selectedPosition && setSelectedPosition({ ...selectedPosition, lng: e.target.value }) }}> </IonInput>
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
          defaultCenter={{ lat: props.location.latitude || 0, lng: props.location.longitude || 0 }}
          defaultZoom={11}
          onDragsStart={(map) => { setMapCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() }); setpositionSelected(false) }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={x => initPolyLines(x)}
          onDragEnd={(map) => { setMapCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() }); setpositionSelected(false) }}
        >
          {selectedPosition && <div lat={selectedPosition.lat} lng={selectedPosition.lng} hover="false"><AddLocationIcon name="pin" className="locationPin " ></AddLocationIcon></div>}
        </GoogleMap>

        {!positionSelected && <div hover="false"><LocationSearchingIcon className="locationCrosshair iconSize markerFixed" ></LocationSearchingIcon></div>}
      </div>
      <div className='bottomContainer'>
        <IonCard color="light">
          <IonGrid>
            {positionSelected && <IonRow>
              <IonCol size="8">
                <IonRange color="primary" pin={true} value={radius} onIonChange={x => setRadius(x.detail.value)} />

              </IonCol>
              <IonCol className="vcentered">
                <IonButton onClick={() => {
                  props.save(mapCenter.lat, mapCenter.lng, radius);
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
