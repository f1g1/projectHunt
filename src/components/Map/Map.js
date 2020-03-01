import React from "react";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import "./Map.css";
import SimpleMap from "./SimpleMap";

const LocationMarker = ({ lat, lng }) => (
  <LocationOnRoundedIcon className="map-user-image" lat={lat} lng={lng} />
);

const MapWithLocation = props => {
  console.log("MAP COORD2S", props.coords);
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
