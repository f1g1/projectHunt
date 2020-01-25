import React from "react";
import GoogleMapReact from "google-map-react";
import { ReactComponent as ShipSVG } from "../../resources/ship.svg";

import "./Map.css";
import SimpleMap from "./SimpleMap";

const LocationMarker = ({ lat, lng }) => (
  <ShipSVG className="map-user-image" lat={lat} lng={lng} />
);

const MapWithLocation = props => {

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100%", width: "100%" }}>
      <SimpleMap coords={props.coords}>
        <LocationMarker
          lat={props.coords.latitude}
          lng={props.coords.longitude}
        />
      </SimpleMap>
    </div>
  );
};

export default MapWithLocation;
