import "./Map.css";

import GoogleMap from "google-map-react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import React from "react";
import { mapStyle } from "../../resources/mapStyle";

const LocationMarker = ({ lat, lng }) => (
  <LocationOnRoundedIcon className="map-user-image" lat={lat} lng={lng} />
);

const MapWithLocation = (props) => {
  let k = props.coords;
  const initPolyLines = (google) => {
    let ppolyline = new google.maps.Circle({
      //<--note the this
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0.2,
      center: { lat: props.lat, lng: props.lng },
      radius: 100,
    });
    ppolyline.setMap(google.map);
  };
  const mapOptions = {
    styles: mapStyle,
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMap
        options={mapOptions}
        bootstrapURLKeys={{ key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA" }}
        defaultCenter={k}
        defaultZoom={15}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={(x) => initPolyLines(x)}
      >
        <LocationMarker lat={k.lat} lng={k.lng} />
      </GoogleMap>
    </div>
  );
};

export default MapWithLocation;
