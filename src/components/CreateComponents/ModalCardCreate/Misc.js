import React, { useState, useEffect } from 'react'
import { IonButton, IonRange, IonItem, IonLabel, IonCheckbox, IonModal, IonRow, IonCol } from '@ionic/react';
import GoogleMap from 'google-map-react';

import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import ModalCardCreate from './ModalCardCreate';
import ModalMap from '../ModalMap';
import MiscService from '../../../services/MiscService';


const LocationMarker = ({ lat, lng }) => (
    <LocationOnRoundedIcon style={{
        transform: 'translate(-50%, -100%)'
    }} className="map-user-image" lat={lat} lng={lng} />
);

export default function Misc(props) {
    const [location, setLocation] = useState()
    const [showMapModal, setShowMapModal] = useState(false);
    const [polyline, setpolyline] = useState()

    useEffect(() => {
        MiscService.getCachedGeolocation().then(x => setLocation(x));

    }, [])
    useEffect(() => {
        polyline && polyline.setOptions({ center: props.step.coords, radius: props.step.radius });
        console.log(props.step)
    })
    const initPolyLines = (google) => {
        let ppolyline = new google.maps.Circle({
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillOpacity: 0.2,
            center: props.step.coords,
            radius: props.step.radius

        });
        ppolyline.setMap(google.map);
        setpolyline(ppolyline);
    }
    const handleCloseMap = () => {
        setShowMapModal(false);
    };
    const saveLocation = (lat, lng, radius) => {
        props.setStep({ ...props.step, coords: { lat, lng }, radius })
    }
    return (
        <>
            <IonButton onClick={() => setShowMapModal(true)} fill="outline">Location</IonButton>

            <IonItem>
                <IonLabel>
                    Points: {props.step.points && props.step.points}
                </IonLabel>
                <IonRange min="100" max="2000" step="10" pin={true} value={props.step.points} onIonChange={x => props.setStep({ ...props.step, points: x.detail.value })} />
            </IonItem>

            <IonItem>
                <IonLabel>
                    Hidden
                </IonLabel>
                <IonCheckbox value={props.step.hidden} onIonChange={x => props.setStep({ ...props.step, hidden: x.detail.checked })} />
            </IonItem>
            <IonRow>
                <IonCol>
                    {props.step.coords && <div style={{ height: "250px" }}>
                        <div style={{ height: '100%', width: '100%' }}>

                            <GoogleMap
                                bootstrapURLKeys={{ key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA" }}
                                defaultCenter={props.step.coords}
                                center={props.step.coords}
                                defaultZoom={15}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={x => initPolyLines(x)}
                            >
                                <LocationMarker
                                    {...props.step.coords}
                                />
                            </GoogleMap>
                        </div>
                    </div>}
                </IonCol>
            </IonRow>



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



    )
}
