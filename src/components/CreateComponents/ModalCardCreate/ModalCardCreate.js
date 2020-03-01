import React, { useState, useContext, useEffect } from "react";
import {
  IonHeader,
  IonCol,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonInput,
  IonRow,
  IonToast
} from "@ionic/react";
import { AppContext } from "../../../StateCreateGame";

const makeid = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export default function ModalCardCreate(props) {
  const [code, setCode] = useState("");
  const [clue, setClue] = useState("");
  const [showToast1, setShowToast1] = useState(false);
  const { state, dispatch } = useContext(AppContext);

  const saveNewStep = () => {
    dispatch({
      type: "addStep",
      step: { clue, code }
    });
    setCode("");
    setClue("");
    setShowToast1(true);
  };
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <IonHeader color="secondary">
        Create a new step in your adventure!
      </IonHeader>
      <IonContent color="secondary">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Clue</IonLabel>
            <IonTextarea
              value={clue}
              onIonChange={e => setClue(e.target.value)}
              maxlength="100"
            ></IonTextarea>
          </IonItem>

          <IonItem>
            <IonLabel>Code:</IonLabel>
            <IonInput
              value={code}
              onIonChange={e => {
                setCode(e.target.value);
                console.log(e.target.value);
              }}
              maxlength="12"
            ></IonInput>
            <IonButton
              onClick={() => setCode(makeid(6))}
              disabled={code !== ""}
            >
              Generate
            </IonButton>
          </IonItem>
        </IonList>
        <IonRow>
          <IonButton color="danger" onClick={props.handleClose}>
            X
          </IonButton>
          <IonButton onClick={saveNewStep}>Save Step!</IonButton>
        </IonRow>
      </IonContent>
      <IonToast
        isOpen={showToast1}
        onDidDismiss={() => setShowToast1(false)}
        message="You added a new step!"
        duration={1000}
        position="top"
        color="light"
        mode="ios"
      />
    </>
  );
}
