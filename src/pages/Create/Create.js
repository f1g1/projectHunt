import React, { useEffect, useState, useContext } from "react";
import {
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
  IonModal,
  IonButton,
  IonPage,
  IonFabButton,
  IonInput,
  IonLabel,
  IonItem,
  IonRange
} from "@ionic/react";
import { Geolocation } from "@capacitor/core";
import "./Create.css";
import { AppContext as CreateGameContext } from "../../StateCreateGame";

import ModalMap from "../../components/CreateComponents/ModalMap";

import MarginCard from "../../components/CreateComponents/Cards/MarginCard";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import AddIcon from "@material-ui/icons/Add";
import ModalCardCreate from "../../components/CreateComponents/ModalCardCreate/ModalCardCreate";
import ReorderableCards from "./ReorderableCards";
import { GamesService } from "../../services/GameService";
const Create = () => {

  const { state, dispatch } = useContext(CreateGameContext);

  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [showBeginModal, setShowBeginModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  useEffect(() => {
    Geolocation.getCurrentPosition().then(x => handleReceivedLocation(x));
  }, []);

  const saveStart = (lat, lng) => {
    dispatch({
      type: "setStartCoords",
      lat,
      lng
    });
  };
  const saveFinish = (lat, lng) => {
    dispatch({
      type: "setFinishCoords",
      lat,
      lng
    });
  };
  const setTitle = title => {
    dispatch({
      type: "setTitle",
      title
    });
  };
  const setMaxPlayers = maxPlayers => {
    dispatch({
      type: "setMaxPlayers",
      maxPlayers
    });
  };
  const handleClose = () => {
    setShowBeginModal(false);
  };
  const handleCloseFinish = () => {
    setShowEndModal(false);
  };
  const saveGame = () => {
    GamesService.saveGame(state);
  };
  let handleReceivedLocation = location => {
    console.log(location);

    setGeolocation(location.coords);
    console.log("set");
  };
  return (
    <IonPage>
      <IonContent>
        <IonGrid className="fullHeight">
          <IonRow className="fullHeight">
            <IonCol sizeXs="2" sizeMd="1" sizeXl="0.5"></IonCol>

            <IonContent>
              <IonRow>
                <IonCol size="4">
                  <IonItem>
                    <IonLabel position="floating">Title</IonLabel>
                    <IonInput
                      onIonChange={e => setTitle(e.target.value)}
                    ></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol size="5">
                  <IonItem>
                    <IonLabel>Max players/team</IonLabel>
                    <IonRange min={1} max={12} color="secondary" snaps pin onIonChange={e => setMaxPlayers(e.target.value)} value={state.maxPlayers}>
                      <IonLabel slot="start">1</IonLabel>
                      <IonLabel slot="end">12</IonLabel>
                    </IonRange>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="4">
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
                    <IonCol size="3">
                      <div className="arrow">
                        <KeyboardArrowDownIcon />
                      </div>
                    </IonCol>
                  </IonRow>
                  <ReorderableCards />
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
                      <div className="arrow">
                        <KeyboardArrowDownIcon />
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
                </IonCol>
              </IonRow>
              <IonButton onClick={() => setShowBeginModal(true)}>
                Show Modal
                </IonButton>
              <IonButton onClick={() => saveGame()}>SaveGame</IonButton>
            </IonContent>
          </IonRow>
        </IonGrid>
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
      </IonContent>
    </IonPage>
  );
};
export default Create;