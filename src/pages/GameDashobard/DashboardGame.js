import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonFabButton,
  IonLabel,
  IonModal,
  IonRow,
  IonTitle,
} from "@ionic/react";
import React, { useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import { DashboardService } from "../../services/DashboardService";
import GoogleMap from "google-map-react";
import { LobbyService } from "../../services/LobbyService";
import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";
import ModalCardCreate from "../../components/CreateComponents/ModalCardCreate/ModalCardCreate";

const types = ["Text", "Qr Code", "Photo"];
const LocationMarker = ({ lat, lng }) => (
  <LocationOnRoundedIcon
    style={{
      transform: "translate(-50%, -100%)",
    }}
    className="map-user-image"
    lat={lat}
    lng={lng}
  />
);

export default function DashboardGame(props) {
  const [polyline, setpolyline] = useState();
  const [showAddCardModal, setShowAddCardModal] = useState();

  const addFromDashboard = (step) => {
    DashboardService.addStep(LobbyService.getCurrentLobby(), {
      ...step,
      index: props.game.steps.length,
      id: Date.now(),
    });
  };
  const initPolyLines = (google, x) => {
    let ppolyline = new google.maps.Circle({
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillOpacity: 0.2,
      center: x.coords,
      radius: x.radius,
    });
    ppolyline.setMap(google.map);
    setpolyline(ppolyline);
  };
  return (
    <>
      <IonTitle>Game Challenges</IonTitle>
      {props.game.steps.map((x, index) => (
        <IonCard
          color="light"
          className="ion-padding-vertical ion-margin-vertical"
          key={index}
        >
          <IonCardContent>
            <IonCardTitle>Challenge #{x.index + 1}</IonCardTitle>
            <IonRow>
              <IonCol sizeXl="3">
                {!x.image ? (
                  <div
                    style={{
                      background: "grey",
                      width: "180px",
                      height: "100px",
                    }}
                  ></div>
                ) : (
                  <img
                    src={x.image}
                    style={{
                      height: "100px",
                      width: "auto",
                      maxWidth: "220px",
                    }}
                  ></img>
                )}
              </IonCol>
              <IonCol sizeXl="6" sizeXs="12">
                <p>Clue:</p>
                <IonLabel>{x.clue}</IonLabel>
              </IonCol>
              <IonCol className="ion-text-center">
                <IonLabel>
                  {x.hidden && "Hidden!"}
                  {x.visible && "Visible!"}

                  {(x.visible || x.hidden) && (
                    <div style={{ height: "250px" }}>
                      <div style={{ height: "100%", width: "100%" }}>
                        <GoogleMap
                          bootstrapURLKeys={{
                            key: "AIzaSyAueqYGiXRddw8fmqzkN01aBJXu_SbkAnA",
                          }}
                          defaultCenter={x.coords}
                          center={x.coords}
                          defaultZoom={15}
                          yesIWantToUseGoogleMapApiInternals
                          onGoogleApiLoaded={(g) => initPolyLines(g, x)}
                        >
                          <LocationMarker {...x.coords} />
                        </GoogleMap>
                      </div>
                    </div>
                  )}
                </IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonLabel>Type: {types[x.answerType]} </IonLabel>
                <br />
                {x.needsValidation && (
                  <IonLabel color="danger">(Needs validation)</IonLabel>
                )}
              </IonCol>
              <IonCol>
                <IonLabel>Answer:</IonLabel>
                <br />
                {x.code || "Photo Answer"}
              </IonCol>
              <IonCol>
                <IonLabel>Allow Once:</IonLabel>
                <br />
                <IonLabel>
                  <p>{x.onlyOnce ? "True" : "False"}</p>
                </IonLabel>
              </IonCol>
              <IonCol>
                <IonLabel>Points:</IonLabel>
                <br />
                <IonLabel>
                  <p>{x.points}</p>
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      ))}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <IonFabButton color="light" onClick={() => setShowAddCardModal(true)}>
          <AddIcon></AddIcon>
        </IonFabButton>
      </div>
      <IonModal
        isOpen={showAddCardModal}
        onDidDismiss={() => setShowAddCardModal(false)}
      >
        <ModalCardCreate
          handleClose={() => setShowAddCardModal(false)}
          dashboard={true}
          addFromDashboard={addFromDashboard}
        ></ModalCardCreate>
      </IonModal>
    </>
  );
}
