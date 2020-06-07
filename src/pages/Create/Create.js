import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";

import CardList from "../../components/CreateComponents/Cards/CardList";
import { AppContext as CreateGameContext } from "../../StateCreateGame";
import GameInformations from "../../components/CreateComponents/Cards/GameInformations";
import { GameService } from "../../services/GameService";
import MiscService from "../../services/MiscService";
import QrModal from "./QrModal";

const Create = (props) => {
  const { state, dispatch } = useContext(CreateGameContext);
  const [isEdit, setisEdit] = useState(false);
  const [geolocation, setGeolocation] = useState();
  const [errorToast, setErrorToast] = useState();
  const [showQrModal, setShowQrModal] = useState(false);
  let handleReceivedLocation = () => {
    MiscService.getCachedGeolocation()
      .then((x) => {
        x && setGeolocation(x);
      })
      .catch(() => {
        console.log("EERROR");
        setGeolocation({
          latitude: 45.9432,
          longitude: 24.9668,
        });
      });
  };
  useEffect(() => {
    handleReceivedLocation();
    if (props.location.game) {
      dispatch({
        type: "setGame",
        game: { ...props.location.game, cloneSteps: props.location.game.steps },
      });
      setisEdit(true);
    }
  }, []);
  const setLocation = (loc) => {
    setGeolocation(loc);
  };
  const saveGame = () => {
    let errors = validateGame(state);
    if (errors.length === 0) GameService.saveGame(state);
    else {
      setErrorToast(errors);
    }
  };
  const validateGame = (game) => {
    let errors = "";
    if (!game.title || game.title.length < 3)
      errors += "Title can't be less than 3 characters long.";
    if (!game.steps || game.steps.length < 1)
      errors += "\nCan't create a game without any challenges in it.";
    if (!game.password || game.password < 3)
      errors += "\nYou need to set an entry code for your game";

    return errors;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons style={{ display: "inline-block" }}>
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle style={{ display: "inline-block" }}>
            {isEdit ? "Edit" : "Create new"} Treasure Hunt!
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeXl="8" sizeLg="6" sizeSm="12">
              {geolocation && (
                <GameInformations
                  geolocation={geolocation}
                  setLocation={setLocation}
                />
              )}
            </IonCol>
            <IonCol sizeXl="4" sizeSm="12">
              <IonCol sizeXl="4" sizeSm="12">
                {geolocation && <CardList geolocation={geolocation} />}
              </IonCol>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons className="ion-padding-horizontal">
            <IonButton slot="end" onClick={() => saveGame()} color="primary">
              SaveGame
            </IonButton>
            <IonButton slot="end" onClick={() => setShowQrModal(true)}>
              QRs
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
      <IonToast
        color="danger"
        position="top"
        isOpen={errorToast !== undefined}
        onDidDismiss={() => setErrorToast()}
        message={errorToast}
        duration={2000}
      />
      {state.steps && (
        <IonModal
          isOpen={showQrModal}
          onDidDismiss={() => setShowQrModal(false)}
        >
          <QrModal
            handleClose={() => setShowQrModal(false)}
            steps={state.steps}
          ></QrModal>
        </IonModal>
      )}
    </IonPage>
  );
};
export default Create;
