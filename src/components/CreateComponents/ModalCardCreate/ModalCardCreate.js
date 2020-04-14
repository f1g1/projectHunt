import "./ModalCard.scss";

import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonLabel, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";

import AddBoxIcon from '@material-ui/icons/AddBox';
import { AppContext } from "../../../StateCreateGame";
import Challenge from "./Challenge";
import EditIcon from '@material-ui/icons/Edit';
import Misc from "./Misc";
import Response from "./Response";

export default function ModalCardCreate(props) {
  const [showToast1, setShowToast1] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [segmentOn, setSegmentOn] = useState("challenge")
  const [step, setStep] = useState({
    points: 100, answerType: 0, validateAnswer: false, clue: null,
    wrongResponseTitle: null, wrongResponseAdditionalInfo: null, succesResponseTitle: null, succesResponseAdditionalInfo: null
  })
  useEffect(() => {
    if (props.edit)
      setStep(props.edit)
  }, [])

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
    debugger;
    if (props.edit) {
      let steps = state.steps;
      steps.forEach((element, i) => {
        if (element.id === step.id)
          steps[i] = step;
      });
      dispatch({
        type: "setSteps",
        steps
      });
    } else {
      //this is for create
      dispatch({
        type: "addStep",
        step: { ...step, id: Date.now() }
      });
      setShowToast1(true);
    }

    props.handleClose();

  };
  useEffect(() => {
    return () => { };
  }, []);
  return (
    <>
      <IonHeader color="secondary">
        <IonToolbar color="primary">
          <IonTitle>
            {props.edit ? <EditIcon /> : <AddBoxIcon />}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton color="danger" onClick={props.handleClose}>
              X
          </IonButton>
            <IonButton onClick={saveNewStep}>Save!</IonButton>
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
