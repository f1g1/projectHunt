import React, { useContext } from "react";
import {
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,
  IonPage,
  IonInput,
  IonLabel,
  IonItem,
  IonRange
} from "@ionic/react";
import "./Create.css";
import { AppContext as CreateGameContext } from "../../StateCreateGame";


import { GamesService } from "../../services/GameService";
import CardList from "../../components/CreateComponents/Cards/CardList";
const Create = () => {
  const { state, dispatch } = useContext(CreateGameContext);

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

  const saveGame = () => {
    GamesService.saveGame(state);
  };

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="5">
              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  onIonChange={e => setTitle(e.target.value)}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel>Max players/team</IonLabel>
                <IonRange min={1} max={12} color="secondary" snaps pin onIonChange={e => setMaxPlayers(e.target.value)} value={state.maxPlayers}>
                  <IonLabel slot="start">1</IonLabel>
                  <IonLabel slot="end">12</IonLabel>
                </IonRange>
              </IonItem>
            </IonCol>
            <IonCol size="5" offset="1">
              <IonButton onClick={() => saveGame()}>SaveGame</IonButton>
              <CardList></CardList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Create;