import "./Card.scss";

import { IonCol, IonFabButton, IonModal, IonRow } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import { AppContext as CreateGameContext } from "../../../StateCreateGame";
import MarginCard from "./MarginCard";
import MiscService from "../../../services/MiscService";
import ModalCardCreate from "../ModalCardCreate/ModalCardCreate";
import ModalMap from "../ModalMap";
import ReorderableCards from "../ReorderableCards";

export default function CardList() {
  const { state, dispatch } = useContext(CreateGameContext);
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [showBeginModal, setShowBeginModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showInnerCardModal, setShowAddCardModal] = useState(false);
  const [edit, setEdit] = useState()
  useEffect(() => {
    handleReceivedLocation()
  }, []);

  let handleReceivedLocation = () => {
    MiscService.getCachedGeolocation().then(x => setGeolocation(x));
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

  const handleEditStep = (step) => {
    setEdit(step);
    setShowAddCardModal(true);
  }

  const handleClose = () => {
    setShowBeginModal(false);
  };
  const handleCloseFinish = () => {
    setShowEndModal(false);
  };
  const handleCloseModalCreate = () => {
    setEdit();
    setShowAddCardModal(false);
  }

  return (
    <>
      <IonRow>
        <IonCol>
          <MarginCard
            title="Start location"
            coords={{ lat: state.startLat, lng: state.startLng, radius: state.radius }}
            openModal={() => setShowBeginModal(true)}
            lat={state.startLat}
            lng={state.startLng}
            radius={state.startRadius}
          ></MarginCard>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <ReorderableCards edit={handleEditStep} />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <div className="arrow">
            <IonFabButton
              color="light"
              onClick={() => setShowAddCardModal(true)}>
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
            save={saveStart} />)}
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
            save={saveFinish} />)}
      </IonModal>
      <IonModal
        isOpen={showInnerCardModal}
        onDidDismiss={() => handleCloseModalCreate()}
      >
        <ModalCardCreate
          handleClose={() => handleCloseModalCreate()}
          edit={edit}

        ></ModalCardCreate>
      </IonModal>
    </>)
}
