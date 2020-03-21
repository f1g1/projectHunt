import React, { useContext } from "react";
import {
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,
  IonPage,
  IonFooter,
  IonToolbar,
  IonButtons
} from "@ionic/react";
import { AppContext as CreateGameContext } from "../../StateCreateGame";


import { GamesService } from "../../services/GameService";
import CardList from "../../components/CreateComponents/Cards/CardList";
import GameInformations from "../../components/CreateComponents/Cards/GameInformations";
const Create = () => {
  const { state, dispatch } = useContext(CreateGameContext);



  const saveGame = () => {
    GamesService.saveGame(state);
  };

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>

            <IonCol sizeXl="5" sizeSm="12" offsetXl="1" >
              <GameInformations />


            </IonCol>

            <IonCol sizeXl="5" sizeSm="12" >

              <CardList></CardList>
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