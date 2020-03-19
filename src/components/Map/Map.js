import React from "react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import "./Map.css";
import GoogleMap from 'google-map-react';

const LocationMarker = ({ lat, lng }) => (
  <LocationOnRoundedIcon className="map-user-image" lat={lat} lng={lng} />
);

const MapWithLocation = props => {
  console.log('MAP WITH LOCATION')
  const initPolyLines = (google) => {
    let ppolyline = new google.maps.Circle({//<--note the this
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0.2,
      center: { lat: props.coords.latitude, lng: props.coords.longitude },
      radius: props.radius
    });
    ppolyline.setMap(google.map);
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMap
        bootstrapURLKeys={{
          key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA"
        }}
        defaultCenter={{ lat: props.coords.latitude, lng: props.coords.longitude }}
        defaultZoom={7}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={x => initPolyLines(x)}
      >
        <LocationMarker
          lat={props.coords.latitude}
          lng={props.coords.longitude}
        />
      </GoogleMap>
    </div>
  );
};

export default MapWithLocation;
