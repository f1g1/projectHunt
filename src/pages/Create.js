import React, { useEffect, useState, useContext } from "react";
import { IonContent, IonRow, IonCol, IonGrid, IonModal, IonButton, IonPage } from "@ionic/react";
import { Geolocation } from "@capacitor/core";
import "./Create/Create.css";
import { AppContext as CreateGameContext } from "../StateCreateGame";
import firebase from 'firebase';

// import { useDocument } from "react-firebase-hooks/firestore";
import CreateSideMenu from "../components/CreateComponents/SideMenu";
import ModalMap from "../components/CreateComponents/ModalMap";

const Create = () => {
  const { state, dispatch } = useContext(CreateGameContext);

  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [showBeginModal, setShowBeginModal] = useState(false);
  useEffect(() => {
    Geolocation.getCurrentPosition().then(x => handleReceivedLocation(x));
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    const userRef = db.collection("games").add({
      fullname: "Test",
      email: "rest"
    });
  }, []);

  const saveStart = (lat, lng) => {
    dispatch({
      type: "setStartCoords",
      lat,
      lng
    })
  }
  const handleClose = () => {
    setShowBeginModal(false);
  }
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
            <IonCol
              sizeXs="2"
              sizeMd="1"
              sizeXl="0.5"
              className="side-menu fullHeight"
            >
              <CreateSideMenu />
            </IonCol>
            <IonCol
              sizeXs="10"
              sizeMd="11"
              sizeXl="11.5"
              className="fullHeight"
            >

              <IonContent>
                <IonButton onClick={() => setShowBeginModal(true)}>
                  Show Modal
            </IonButton>
              </IonContent>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonModal isOpen={showBeginModal}
          onDidDismiss={() => setShowBeginModal(false)} defaultLocation={geolocation}>
          {geolocation && <ModalMap handleClose={handleClose} location={geolocation} save={saveStart} />}
        </IonModal>
      </IonContent>
    </IonPage >
  );
}
export default Create;