import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import React, { useContext, useRef, useState } from "react";

import AreaPicker from "../../../pages/Create/AreaPicker";
import { AppContext as CreateGameContext } from "../../../StateCreateGame";

export default function GameInformations(props) {
  const refInput = useRef();
  const { state, dispatch } = useContext(CreateGameContext);
  const [loadingImage, setLoadingImage] = useState(false);
  const [image, setImage] = useState();

  const setTitle = (title) => {
    dispatch({
      type: "setTitle",
      title,
    });
  };
  const setInOrder = (inOrder) => {
    dispatch({
      type: "setinOrder",
      inOrder: inOrder,
    });
  };

  const setDescription = (description) => {
    dispatch({
      type: "setDescription",
      description: description || "",
    });
  };

  const setImageState = (image) => {
    dispatch({
      type: "setImage",
      image,
    });
  };
  const setMaxPlayers = (maxPlayers) => {
    dispatch({
      type: "setMaxPlayers",
      maxPlayers: maxPlayers || 4,
    });
  };
  const setPassword = (password) => {
    dispatch({
      type: "setPassword",
      password: password,
    });
  };
  const setArea = (area) => {
    dispatch({
      type: "setArea",
      value: area,
    });
  };

  const onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLoadingImage(true);
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        setImage(URL.createObjectURL(event.target.files[0]));
        setImageState(event.target.files[0]);
      } else {
        setLoadingImage(false);
        console.log("This file is not an image");
      }
    } else {
      setLoadingImage(false);
    }
  };

  return (
    <div className="stickyContainer">
      <IonRow>
        <IonCol sizeXl="6">
          <IonCard>
            <IonCardContent>
              <IonCardTitle>Game Informations</IonCardTitle>
              <IonList>
                <IonItem lines="full">
                  <IonLabel position="floating" style={{ fontSize: "24px" }}>
                    Title:
                  </IonLabel>
                  <IonInput
                    required
                    value={state.title}
                    onIonChange={(e) => setTitle(e.target.value)}
                    placeholder="Is requiered, 3-50 characters"
                    maxlength="50"
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel>Team Size:</IonLabel>
                  <IonRange
                    min={1}
                    max={12}
                    color="primary"
                    snaps
                    pin
                    onIonChange={(e) => setMaxPlayers(e.target.value)}
                    value={state.maxPlayers}
                  >
                    <IonLabel slot="start">1</IonLabel>
                    <IonLabel slot="end">12</IonLabel>
                  </IonRange>
                  <IonBadge size="large">{state.maxPlayers}</IonBadge>
                </IonItem>
                <IonItem>
                  <IonLabel>Challenges in order:</IonLabel>
                  <IonCheckbox
                    onIonChange={(e) => setInOrder(e.detail.checked)}
                    slot="end"
                    checked={state.inOrder}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Description:</IonLabel>
                  <IonTextarea
                    onIonChange={(e) => setDescription(e.target.value)}
                    value={state.description}
                  ></IonTextarea>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Entry Code*:</IonLabel>
                  <IonInput
                    type="text"
                    onIonChange={(e) => setPassword(e.target.value)}
                    value={state.password}
                    placeholder="Is requiered, 3-20 characters"
                    maxlength="20"
                  />
                </IonItem>
                <IonLabel>
                  <p className="ion-padding-start ">
                    *this code will be used by the users to join your game
                  </p>
                </IonLabel>
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol sizeXl="6">
          <IonCard>
            <IonCardContent>
              <IonCardTitle className="ion-padding-vertical">
                Miscellaneous
              </IonCardTitle>
              <IonButton onClick={() => refInput.current.click()}>
                Add Game Photo
              </IonButton>
              {<img src={image} className="ion-padding-vertical"></img>}

              <input
                ref={refInput}
                accept="image/*"
                className="viewInputGallery"
                type="file"
                onChange={onChoosePhoto}
              />
              <AreaPicker
                setBounds={setArea}
                bounds={state.area}
                geolocation={props.geolocation}
              />
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </div>
  );
}
