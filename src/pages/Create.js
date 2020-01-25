import React, { useEffect, useState } from "react";
import { IonContent, IonRow, IonCol, IonGrid, IonModal, IonButton, IonPage } from "@ionic/react";
import { Geolocation } from "@capacitor/core";
import "./Create/Create.css";
// import { useDocument } from "react-firebase-hooks/firestore";
// import firebase from "firebase/app";
import CreateSideMenu from "../components/CreateComponents/SideMenu";
import ModalMap from "../components/CreateComponents/ModalMap";

const Create = () => {
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  console.log(geolocation)
  const [showBeginModal, setShowBeginModal] = useState(false);
  console.log("create is rendering");
  useEffect(() => {
    console.log("IM IM CREATE")
    Geolocation.getCurrentPosition().then(x => handleReceivedLocation(x));
  }, []);


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
          <ModalMap handleClose={handleClose} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
export default Create;