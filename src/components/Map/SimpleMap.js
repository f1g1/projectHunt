import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import React from 'react'

function MapContainer(props) {
    return (
        <Map
            google={props.google}
            zoom={8}
            initialCenter={{ lat: 47.444, lng: -122.176 }}
        >
        </Map>
    )
}


export default GoogleApiWrapper({
    apiKey: 'AIzaSyAzTj3HlinSmLhPkJWlV1Swo0rEO_MDvoU'
})(MapContainer);
