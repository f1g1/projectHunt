import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";

import CardList from "../../components/CreateComponents/Cards/CardList";
import { AppContext as CreateGameContext } from "../../StateCreateGame";
import GameInformations from "../../components/CreateComponents/Cards/GameInformations";
import { GamesService } from "../../services/GameService";

const Create = (props) => {
  const { state, dispatch } = useContext(CreateGameContext);
  const [isEdit, setisEdit] = useState(false)

  useEffect(() => {
    if (props.location.game) {
      dispatch({
        type: "setGame",
        game: { ...props.location.game, cloneSteps: props.location.game.steps }
      });
      setisEdit(true)
    }
  }, [])

  const saveGame = () => {
    GamesService.saveGame(state)
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
            <IonCol sizeXl="4" sizeLg="6" sizeSm="12" offsetXl="2" >
              <GameInformations />
            </IonCol>
            <IonCol sizeXl="3" sizeLg="6" sizeSm="12" >
              <CardList />
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
    </IonPage>
  );
};
export default Create;