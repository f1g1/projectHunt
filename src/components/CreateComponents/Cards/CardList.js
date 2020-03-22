import React, { useEffect, useState, useContext } from "react";
import AddIcon from "@material-ui/icons/Add";
import ModalCardCreate from "../ModalCardCreate/ModalCardCreate";
import ModalMap from "../ModalMap";
import MarginCard from "./MarginCard"
import { Geolocation } from "@capacitor/core";
import ReorderableCards from "../ReorderableCards";
import {
  IonRow,
  IonCol,
  IonModal,
  IonFabButton,
} from "@ionic/react";
import { AppContext as CreateGameContext } from "../../../StateCreateGame";
import "./Card.scss"



export default function CardList() {
  const { state, dispatch } = useContext(CreateGameContext);
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [showBeginModal, setShowBeginModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition().then(x => handleReceivedLocation(x));
  }, []);

  let handleReceivedLocation = location => {
    console.log(location);

    setGeolocation(location.coords);
    console.log("set");
  };

  const saveStart = (lat, lng, radius) => {
    dispatch({
      type: "setStartCoords",
      lat,
      lng,
      radius
    });
  };
  const saveFinish = (lat, lng, radius) => {
    dispatch({
      type: "setFinishCoords",
      lat,
      lng,
      radius
    });
  };
  const handleClose = () => {
    setShowBeginModal(false);
  };
  const handleCloseFinish = () => {
    setShowEndModal(false);
  };
  return (
    <>
      <IonRow>

        <IonCol>
          <MarginCard
            title="Start location"
            coords={{ lat: state.startLat, lng: state.startLng }}
            openModal={() => setShowBeginModal(true)}
            lat={state.startLat}
            lng={state.startLng}
          ></MarginCard>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <ReorderableCards />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <div className="arrow">
            <IonFabButton
              color="light"
              onClick={() => setShowAddCardModal(true)}
            >
              <AddIcon></AddIcon>
            </IonFabButton>
          </div>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <MarginCard
            title="Finish location"
            coords={{
              lat: state.finishLat,
              lng: state.finishLng
            }}
            openModal={() => setShowEndModal(true)}
            lat={state.finishLat}
            lng={state.finishLng}
          ></MarginCard>
        </IonCol>
      </IonRow>

      <IonModal
        isOpen={showBeginModal}
        onDidDismiss={() => setShowBeginModal(false)}
        defaultLocation={geolocation}
      >
        {geolocation && (
          <ModalMap
            handleClose={handleClose}
            location={geolocation}
            save={saveStart}
          />
        )}
      </IonModal>
      <IonModal
        isOpen={showEndModal}
        onDidDismiss={() => setShowEndModal(false)}
        defaultLocation={geolocation}
      >
        {geolocation && (
          <ModalMap
            handleClose={handleCloseFinish}
            location={geolocation}
            save={saveFinish}
          />
        )}
      </IonModal>
      <IonModal
        isOpen={showAddCardModal}
        onDidDismiss={() => setShowAddCardModal(false)}
      >
        <ModalCardCreate
          handleClose={() => setShowAddCardModal(false)}
        ></ModalCardCreate>
      </IonModal>
    </>)
}
