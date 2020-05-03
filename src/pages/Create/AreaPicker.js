import React, { useEffect, useState } from 'react';

import GoogleMap from 'google-map-react';
import { IonButton } from '@ionic/react';

export default function AreaPicker(props) {
    const [shape, setShape] = useState()
    const [bounds, setBounds] = useState()
    const [modifying, setmodifying] = useState(false)
    useEffect(() => {

        shape && handleArea()
    }, [shape])


    const handleArea = () => {

        let initialBounds = [{ lat: props.geolocation.latitude + 0.01, lng: props.geolocation.longitude + 0.01 },
        { lat: props.geolocation.latitude + 0.01, lng: props.geolocation.longitude - 0.01 },
        { lat: props.geolocation.latitude - 0.01, lng: props.geolocation.longitude - 0.01 },
        { lat: props.geolocation.latitude - 0.01, lng: props.geolocation.longitude + 0.01 }]

        let auxBounds = props.bounds ? props.bounds : initialBounds;
        setmodifying(true);
        shape.setOptions({ path: auxBounds, editable: true });
        setBounds(auxBounds)
    }
    const initShape = (google) => {

        var shape = new google.maps.Polygon({
            path: bounds,
            geodesic: true,
            strokeOpacity: 0.5,
            strokeWeight: 1,
            // strokeColor: "#00e6a8",
            fillColor: "#42656e",
            fillOpacity: .3,
        });
        shape.setMap(google.map);
        setShape(shape);
    }

    const saveArea = () => {
        setmodifying(false);
        var polygonBounds = shape.getPath();
        shape.setOptions({ editable: false })
        var auxBounds = [];
        for (var i = 0; i < polygonBounds.length; i++) {
            var point = {
                lat: polygonBounds.getAt(i).lat(),
                lng: polygonBounds.getAt(i).lng()
            };
            auxBounds.push(point);
        }
        props.setBounds(auxBounds);
    }
    const change = () => {
        shape.setOptions({ editable: true })
        setmodifying(true);
    }

    return (
        <>
            {(props.bounds || modifying) && (<div>
                <div style={{ height: "300px", width: "100%" }}>

                    <GoogleMap
                        bootstrapURLKeys={{ key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA" }}
                        defaultCenter={{ lat: props.geolocation.latitude, lng: props.geolocation.longitude }}
                        defaultZoom={15}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={x => initShape(x)} />

                    <div style={{ position: "absolute", bottom: "10px" }}>
                        {!modifying ?
                            <IonButton onClick={change} color="primary">Change</IonButton>
                            :
                            <IonButton onClick={saveArea} color="success">Save Area</IonButton>
                        }
                    </div>

                </div>

            </div>)
            }
            {!props.bounds && !modifying && <IonButton onClick={() => setmodifying(true)}>Add Playing Area</IonButton>}
        </>
    )
}
