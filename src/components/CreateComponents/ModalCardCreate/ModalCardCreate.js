import React, { useState, useContext, useEffect, useRef } from "react";
import {
  IonHeader,
  IonContent,
  IonLabel,
  IonButton,
  IonRow,
  IonToast,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonCol,
  IonButtons
} from "@ionic/react";

import { AppContext } from "../../../StateCreateGame";
import Challenge from "./Challenge";
import Misc from "./Misc";
import Response from "./Response";
import "./ModalCard.scss";

export default function ModalCardCreate(props) {
  const [code, setCode] = useState("");
  const [clue, setClue] = useState("");
  const [showToast1, setShowToast1] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [currentFile, setCurrentFile] = useState()
  const [answerType, setAnswerType] = useState(0)
  const [answer, setAnswer] = useState(0)
  const [imageUrl, setImageUrl] = useState()
  const [segmentOn, setSegmentOn] = useState("challenge")
  const [validateAnswer, setValidateAnswer] = useState()
  const [step, setStep] = useState({ points: 100 })


  const RenderSegment = () => {
    switch (segmentOn) {
      case "challenge":
        return (<Challenge
          step={step}
          setStep={setStep}
        />);
      case "misc":
        return (<Misc step={step}
          setStep={setStep} />);
      case "response":
        return (<Response step={step}
          setStep={setStep} />);
      default:
        break;
    }
  }
  const saveNewStep = () => {
    dispatch({
      type: "addStep",
      step: { clue, code, answerType, answer, image: currentFile, imageUrl, validateAnswer, id: Date.now() }
    });
    setShowToast1(true);
  };
  useEffect(() => {
    return () => { };
  }, []);
  return (
    <>
      <IonHeader color="secondary">
        <IonToolbar color="primary">
          <IonTitle>
            Create a new step in your adventure!
        </IonTitle>
          <IonButtons slot="end">
            <IonButton color="danger" onClick={props.handleClose}>
              X
          </IonButton>
            <IonButton onClick={saveNewStep}>Save Step!</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonSegment value={segmentOn} color="primary" onIonChange={x => setSegmentOn(x.detail.value)}>
          <IonSegmentButton value="challenge">
            <IonLabel>Challenge</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="misc">
            <IonLabel>Misc</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="response">
            <IonLabel>Response</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonRow >
          <IonCol>
            {RenderSegment()}
          </IonCol>
        </IonRow>




      </IonContent >
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
