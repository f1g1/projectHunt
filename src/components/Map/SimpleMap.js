import GoogleMapReact from 'google-map-react';
import "./Map.css";
import React from 'react'
const AnyReactComponent = ({ text }) => <div>{text}</div>;

let SimpleMap = (props) => {

  let defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAzTj3HlinSmLhPkJWlV1Swo0rEO_MDvoU"
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <div className="marker">X</div>
      </GoogleMapReact>
    </div>
  );
}

export default SimpleMap;