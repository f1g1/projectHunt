import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";

import CardList from "../../components/CreateComponents/Cards/CardList";
import { AppContext as CreateGameContext } from "../../StateCreateGame";
import GameInformations from "../../components/CreateComponents/Cards/GameInformations";
import { GameService } from "../../services/GameService";
import MiscService from "../../services/MiscService";

const Create = (props) => {
  const { state, dispatch } = useContext(CreateGameContext);
  const [isEdit, setisEdit] = useState(false)
  const [geolocation, setGeolocation] = useState({ lat: 0, lng: 0 });
  const [errorToast, setErrorToast] = useState()

  let handleReceivedLocation = () => {
    MiscService.getCachedGeolocation().then(x => setGeolocation(x));
  };
  useEffect(() => {
    handleReceivedLocation();
    if (props.location.game) {
      dispatch({
        type: "setGame",
        game: { ...props.location.game, cloneSteps: props.location.game.steps }
      });
      setisEdit(true)
    }
  }, [])

  const saveGame = () => {
    let errors = validateGame(state)
    if (errors.length === 0)
      GameService.saveGame(state)
    else {
      setErrorToast(errors);

    }

  }
  const validateGame = (game) => {
    let errors = "";
    if (!game.title || game.title.length < 3)
      errors += "Title can't be less than 3 characters long.";
    if (!game.steps || game.steps.length < 1)
      errors += "\nCan't create a game without any challenges in it."
    if (!game.password || game.password < 3)
      errors += "\nYou need to set an entry code for your game"

    return errors;
  }




  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons style={{ display: "inline-block" }}>
            <IonBackButton defaultHref='/home'></IonBackButton>
          </IonButtons>
          <IonTitle style={{ display: "inline-block" }} >
            {isEdit ? "Edit" : "Create new"} Treasure Hunt!
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeXl="8" sizeLg="6" sizeSm="12"  >
              <GameInformations geolocation={geolocation} />
            </IonCol>
            <IonCol sizeXl="3" sizeLg="6" sizeSm="12" >
              <CardList geolocation={geolocation} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar >
          <IonButtons slot="end">
            <IonButton slot="end" onClick={() => saveGame()} color="primary">SaveGame</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
      <IonToast
        color="danger"
        position='top'
        isOpen={errorToast !== undefined}
        onDidDismiss={() => setErrorToast()}
        message={errorToast}
        duration={2000}
      />
    </IonPage>
  );
};
export default Create;