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
import { person } from "ionicons/icons";
import MediaService from "../../services/MediaService";
const Create = () => {
  const { state, dispatch } = useContext(CreateGameContext);



  const saveGame = async () => {
    let objToUpdate = { ...state };
    delete objToUpdate.cloneSteps;
    delete objToUpdate.image;
    //todo we need to wait for all images to upload
    let promises = [];
    objToUpdate.steps.forEach(element => {
      delete element.imageUrl;
      promises.push(MediaService.SaveImageStep(element.image))
    });
    debugger;
    Promise.allSettled(promises)
      .then(v => {
        v.forEach((image, i) => {
          debugger;
          if (image)
            objToUpdate.steps[i].image = image.value
        })
        MediaService.SaveImageStep(state.image)
          .then(x => { debugger; objToUpdate.image = x; GamesService.saveGame(objToUpdate); })
      })



  };

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeXl="4" sizeSm="12" offsetXl="2" >
              <GameInformations />
            </IonCol>
            <IonCol sizeXl="3" sizeSm="12" >
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