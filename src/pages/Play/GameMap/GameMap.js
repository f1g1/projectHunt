import "./GameMap.scss";

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import GoogleMap from "google-map-react";
import { LobbyService } from "../../../services/LobbyService";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import { PlayService } from "../../../services/PlayService";
import { UserService } from "../../../services/UserSerivce";

const MyLocationMarker = ({ lat, lng }) => (
  <>
    <div className="labelLocation">My Location</div>
    <LocationOnRoundedIcon className="map-user-to-share" lat={lat} lng={lng} />
  </>
);
const LocationMarker = ({ lat, lng, name }) => (
  <>
    <div className="labelLocation">{name}</div>
    <LocationOnRoundedIcon className="map-user-image" lat={lat} lng={lng} />
  </>
);
const AdminPointMarker = ({ lat, lng, notsetted = false }) => (
  <>
    <div
      className={
        notsetted ? "labelLocation admin notSetted" : "labelLocation admin"
      }
    >
      Admin point
    </div>
    <LocationOnRoundedIcon
      className={notsetted ? "map-admin-point notSetted" : "map-admin-point"}
      lat={lat}
      lng={lng}
    />
  </>
);

const ChallengeLocation = ({ lat, lng, index, hidden }) => (
  <>
    <div className={!hidden ? "labelLocation" : "labelLocation hidden"}>
      Challenge #{index + 1}
      {hidden && (
        <IonLabel>
          <p>(hidden)</p>
        </IonLabel>
      )}
    </div>
    <CloseIcon
      className={!hidden ? "map-admin-point" : "hidden-challenge"}
      lat={lat}
      lng={lng}
    />
  </>
);

export default function GameMap(props) {
  const [mapCenter, setMapCenter] = useState();
  const [messageToast, setMessageToast] = useState();
  const [errorToast, setErrorToast] = useState();
  const [shape, setShape] = useState();
  const [modifyingArea, setModifyingArea] = useState(false);
  const [bounds, setBounds] = useState(props.game.area);
  const [handlingPoint, setHandlingPoint] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState();
  const [visibleChallenges, setVisibleChallenges] = useState();
  const [incrV, setincrV] = useState();
  const handleSavePoint = () => {
    setSelectedPosition();
    setHandlingPoint(false);

    PlayService.saveAdminPoint(selectedPosition)
      .then(() => {
        setMessageToast("Point succesfully placed on the map!");
      })
      .catch(() => {
        setErrorToast("Point was not placed!");
      });
  };
  useEffect(() => {
    let team = props.teams.filter((x) =>
      x.players.includes(UserService.getCurrentPlayer().name)
    )[0];
    // team ?{
    if (team) {
      let activeChallenges = PlayService.getActiveSteps(
        props.game,
        team.name,
        props.teams
      );
      let z = activeChallenges.filter((x) => x.hidden || x.visible);
      setVisibleChallenges(
        activeChallenges.filter((x) => x.hidden || x.visible)
      );
    } else {
      setVisibleChallenges(
        props.game.steps.filter((x) => x.hidden || x.visible)
      );
    }
    setincrV(incrV + 1);
  }, [props.teams, props.game]);

  useEffect(() => {
    console.log(visibleChallenges);
  }, [visibleChallenges]);

  const handleMarkCenter = () => {
    setSelectedPosition(mapCenter);
  };
  const cancelArea = () => {
    setBounds(props.game.bounds);
    shape.setOptions({ editable: false });
    setModifyingArea(false);
  };
  const cancelPoint = () => {
    setHandlingPoint(false);
    setSelectedPosition();
  };
  const saveArea = () => {
    var polygonBounds = shape.getPath();
    var auxBounds = [];
    for (var i = 0; i < polygonBounds.length; i++) {
      var point = {
        lat: polygonBounds.getAt(i).lat(),
        lng: polygonBounds.getAt(i).lng(),
      };
      auxBounds.push(point);
    }
    PlayService.saveArea(auxBounds)
      .then(() => {
        shape.setOptions({ editable: false });
        setModifyingArea(false);
        setMessageToast("Playing area updated succesfully");
        setBounds(auxBounds);
      })
      .catch((e) => {
        setErrorToast("Can't update area right now, try later");
      });
  };
  const shareLocation = () => {
    let team = props.teams.filter((x) =>
      x.players.includes(UserService.getCurrentPlayer().name)
    )[0];
    PlayService.shareLocation(props.geolocation, team.name, props.game);
    setMessageToast(
      "You shared your location, your location will show on the map"
    );
  };
  const handleArea = () => {
    let initialBounds = [
      {
        lat: props.geolocation.latitude + 0.01,
        lng: props.geolocation.longitude + 0.01,
      },
      {
        lat: props.geolocation.latitude + 0.01,
        lng: props.geolocation.longitude - 0.01,
      },
      {
        lat: props.geolocation.latitude - 0.01,
        lng: props.geolocation.longitude - 0.01,
      },
      {
        lat: props.geolocation.latitude - 0.01,
        lng: props.geolocation.longitude + 0.01,
      },
    ];
    let pathBounds = bounds;
    if (!bounds) {
      setBounds(initialBounds);
      pathBounds = initialBounds;
    }
    shape.setOptions({ path: pathBounds, editable: true });
    setModifyingArea(true);
  };

  const initShape = (google) => {
    var shape = new google.maps.Polygon({
      path: bounds,
      geodesic: true,
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: "#42656e",
      fillOpacity: 0.3,
    });
    shape.setMap(google.map);
    setShape(shape);
  };

  const handlePoint = () => {
    setHandlingPoint(true);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons>
            <IonButton onclick={props.handleClose}>
              <CloseIcon />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ height: "100%", width: "100%" }}>
          <GoogleMap
            bootstrapURLKeys={{
              key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA",
            }}
            defaultCenter={{
              lat: props.geolocation.latitude,
              lng: props.geolocation.longitude,
            }}
            defaultZoom={15}
            yesIWantToUseGoogleMapApiInternals
            onDragEnd={(map) => {
              setMapCenter({
                lat: map.getCenter().lat(),
                lng: map.getCenter().lng(),
              });
            }}
            onGoogleApiLoaded={(x) => initShape(x)}
          >
            {visibleChallenges &&
              visibleChallenges.map((x) => {
                return (
                  <ChallengeLocation
                    key={x.index}
                    lat={x.coords.lat}
                    lng={x.coords.lng}
                    index={x.index}
                    hidden={x.hidden}
                  />
                );
              })}
            <MyLocationMarker
              lat={props.geolocation.latitude}
              lng={props.geolocation.longitude}
            />
            {props.game.adminPoint && (
              <AdminPointMarker
                lat={props.game.adminPoint.lat}
                lng={props.game.adminPoint.lng}
              />
            )}
            {selectedPosition && (
              <AdminPointMarker {...selectedPosition} notsetted={true} />
            )}

            {props.teams &&
              props.teams.map((x, index) => {
                {
                  if (x.location)
                    return (
                      <LocationMarker
                        key={index + "mark"}
                        lat={x.location[x.location.length - 1].lat}
                        lng={x.location[x.location.length - 1].lng}
                        name={x.name}
                      />
                    );
                }
              })}
          </GoogleMap>
          {handlingPoint && (
            <div hover="false">
              <LocationSearchingIcon className="locationCrosshair iconSize markerFixed"></LocationSearchingIcon>
            </div>
          )}
          {LobbyService.ImAdmin(props.game) && (
            <div className="leftContainer">
              {!handlingPoint ? (
                <IonButton onClick={handlePoint} color="tertiary">
                  Set Admin point
                </IonButton>
              ) : (
                <>
                  <div>
                    {!selectedPosition ? (
                      <IonButton color="success" onclick={handleMarkCenter}>
                        Mark Here
                      </IonButton>
                    ) : (
                      <IonButton onclick={handleSavePoint}>Save!</IonButton>
                    )}
                    <IonButton color="danger" onclick={cancelPoint}>
                      X
                    </IonButton>
                  </div>
                </>
              )}

              {!modifyingArea ? (
                <IonButton onClick={handleArea} color="tertiary">
                  Handle Area
                </IonButton>
              ) : (
                <div>
                  <IonButton onClick={saveArea} color="success">
                    Save Area
                  </IonButton>
                  <IonButton color="danger" onclick={cancelArea}>
                    X
                  </IonButton>
                </div>
              )}
            </div>
          )}
          {!LobbyService.ImAdmin(props.game) && (
            <div className="bottomContainer">
              <IonButton onClick={shareLocation}>Share Location</IonButton>
            </div>
          )}
        </div>
      </IonContent>
      <IonToast
        color="succes"
        isOpen={messageToast !== undefined}
        onDidDismiss={() => setMessageToast()}
        message={messageToast}
        duration={2000}
        position="top"
      />
      <IonToast
        color="danger"
        position="top"
        isOpen={errorToast !== undefined}
        onDidDismiss={() => setErrorToast()}
        message={errorToast}
        duration={2000}
      />
    </>
  );
}
