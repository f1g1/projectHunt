import "./Card.scss";

import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonFabButton,
  IonModal,
  IonRow,
} from "@ionic/react";
import React, { useContext, useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import { AppContext as CreateGameContext } from "../../../StateCreateGame";
import MarginCard from "./MarginCard";
import ModalCardCreate from "../ModalCardCreate/ModalCardCreate";
import ModalMap from "../ModalMap";
import ReorderableCards from "../ReorderableCards";

export default function CardList(props) {
  const { state, dispatch } = useContext(CreateGameContext);
  const [showBeginModal, setShowBeginModal] = useState(false);
  const [showInnerCardModal, setShowAddCardModal] = useState(false);
  const [edit, setEdit] = useState();
  const saveStart = (lat, lng, radius) => {
    dispatch({
      type: "setStartCoords",
      lat,
      lng,
      radius,
    });
  };

  const handleEditStep = (step) => {
    setEdit(step);
    setShowAddCardModal(true);
  };

  const handleClose = () => {
    setShowBeginModal(false);
  };

  const handleCloseModalCreate = () => {
    setEdit();
    setShowAddCardModal(false);
  };

  return (
    <>
      <IonCard>
        <IonCardContent className="ion-no-padding">
          <IonCardTitle className="ion-padding-horizontal ion-padding-top">
            Challenges
          </IonCardTitle>
          <IonRow>
            <IonCol>
              <MarginCard
                title="Start location"
                coords={{
                  lat: state.startLat,
                  lng: state.startLng,
                }}
                openModal={() => setShowBeginModal(true)}
                lat={state.startLat}
                lng={state.startLng}
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
              <div className="arrow ion-padding-vertical">
                <IonFabButton
                  color="light"
                  onClick={() => setShowAddCardModal(true)}
                >
                  <AddIcon></AddIcon>
                </IonFabButton>
              </div>
            </IonCol>
          </IonRow>
        </IonCardContent>
      </IonCard>

      {props.geolocation !== -1 && (
        <IonModal
          isOpen={showBeginModal}
          onDidDismiss={() => setShowBeginModal(false)}
          defaultLocation={props.geolocation}
        >
          <ModalMap
            noRadius={true}
            handleClose={handleClose}
            location={props.geolocation}
            save={saveStart}
          />
        </IonModal>
      )}
      <IonModal
        isOpen={showInnerCardModal}
        onDidDismiss={() => handleCloseModalCreate()}
      >
        <ModalCardCreate
          handleClose={() => handleCloseModalCreate()}
          edit={edit}
        ></ModalCardCreate>
      </IonModal>
    </>
  );
}
