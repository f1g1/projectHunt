import { Map, GoogleApiWrapper } from "google-maps-react";

import React from "react";

function MapContainer(props) {
  console.log("MAP COORDS", props.coords);
  return <Map google={props.google} zoom={8} center={props.coords}></Map>;
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAzTj3HlinSmLhPkJWlV1Swo0rEO_MDvoU"
})(MapContainer);
