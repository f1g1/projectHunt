import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonLoading,
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
import CropFreeIcon from "@material-ui/icons/CropFree";
import GameInformations from "../../components/CreateComponents/Cards/GameInformations";
import { GameService } from "../../services/GameService";
import MiscService from "../../services/MiscService";
import QrModal from "./QrModal";
import SaveIcon from "@material-ui/icons/Save";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Create = (props) => {
  const { state, dispatch } = useContext(CreateGameContext);
  const [isEdit, setisEdit] = useState(false);
  const [geolocation, setGeolocation] = useState();
  const [errorToast, setErrorToast] = useState();
  const [loading, setLoading] = useState(false);

  const [showQrModal, setShowQrModal] = useState(false);
  let handleReceivedLocation = () => {
    MiscService.getCachedGeolocation()
      .then((x) => {
        x && setGeolocation(x);
      })
      .catch((x) => {
        console.log("SDASDsda", x);
        setTimeout(function () {
          setGeolocation({
            latitude: 45.9432,
            longitude: 24.9668,
          });
        }, 2000);
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
    if (errors.length === 0) {
      GameService.saveGame(state).then(() => {
        sleep(300).then(() => {
          setLoading(true);
          props.history.replace("/myGames");
        });
      });
    } else {
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
        <IonRow>
          <GameInformations
            geolocation={geolocation}
            setLocation={setLocation}
          />
          <IonCol sizeXl="4">{<CardList geolocation={geolocation} />}</IonCol>
        </IonRow>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons className="ion-padding-horizontal">
            <IonButton
              shape="round"
              shape="round"
              slot="end"
              onClick={() => saveGame()}
              color="primary"
            >
              <SaveIcon />
              Save Game
            </IonButton>
            <IonButton
              shape="round"
              shape="round"
              slot="end"
              onClick={() => setShowQrModal(true)}
            >
              <CropFreeIcon />
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
      <IonLoading isOpen={loading} message={"Please wait..."} duration={5000} />
    </IonPage>
  );
};
export default Create;
