import React, { useState, useContext, useEffect, useRef } from "react";
import {
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonInput,
  IonRow,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonCheckbox
} from "@ionic/react";

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
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
  const refInput = useRef();
  const [code, setCode] = useState("");
  const [clue, setClue] = useState("");
  const [showToast1, setShowToast1] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [loadingImage, setLoadingImage] = useState(false);
  const [currentFile, setCurrentFile] = useState()
  const [answerType, setAnswerType] = useState(0)
  const [answer, setAnswer] = useState(0)
  const [imageUrl, setImageUrl] = useState()
  const [validateAnswer, setValidateAnswer] = useState()

  const generateQR = (code) => {
    console.log("generate qr")
    BarcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE, code, function (success) {
      console.log("succes")
      alert("encode success: " + success);
    }, function (fail) {
      console.log("failed")
      alert("encoding failed: " + fail);
    }
    );
  }
  const onChoosePhoto = event => {
    if (event.target.files && event.target.files[0]) {
      setLoadingImage(true)
      const prefixFiletype = event.target.files[0].type.toString()
      if (prefixFiletype.indexOf('image/') === 0) {
        setImageUrl(URL.createObjectURL(event.target.files[0]));
        setCurrentFile(event.target.files[0])
      } else {
        setLoadingImage(false)
        console.log('This file is not an image')
      }
    } else {
      setLoadingImage(false)
    }
  }

  const saveNewStep = () => {
    dispatch({
      type: "addStep",
      step: { clue, code, answerType, answer, image: currentFile, imageUrl, validateAnswer, id: Date.now() }
    });
    setCode("");
    setClue("");
    setShowToast1(true);
  };
  useEffect(() => {
    return () => { };
  }, []);
  return (
    <>
      <IonHeader color="secondary">
        Create a new step in your adventure!
      </IonHeader>
      <IonContent color="secondary">
        <IonList>
          <IonButton
            onClick={() => refInput.current.click()}
          >Add Photo</IonButton>
          <input
            ref={refInput}
            accept="image/*"
            className="viewInputGallery"
            type="file"
            onChange={onChoosePhoto}
          />
          {currentFile && <img src={imageUrl}></img>}
          <IonItem>
            <IonLabel position="stacked">Clue</IonLabel>
            <IonTextarea
              value={clue}
              onIonChange={e => setClue(e.target.value)}
              maxlength="100"
            ></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel>Answer Type:</IonLabel>
            <IonSelect interface="popover" onIonChange={e => setAnswerType(e.detail.value)} placeholder="Choose answer type">
              <IonSelectOption value={0}>Text</IonSelectOption>
              <IonSelectOption value={1}>QR</IonSelectOption>
              <IonSelectOption value={2}>Photo</IonSelectOption>
            </IonSelect>
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
              onClick={() => generateQR(makeid(6))}
              disabled={code !== ""}
            >
              Generate
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel>Needs Validation?</IonLabel>
            <IonCheckbox onIonChange={e => setValidateAnswer(e.detail.checked)} ></IonCheckbox>
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
