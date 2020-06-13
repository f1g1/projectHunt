import "./ModalCard.scss";

import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "../../../StateCreateGame";
import Challenge from "./Challenge";
import Misc from "./Misc";
import Response from "./Response";

export default function ModalCardCreate(props) {
  const [showToast1, setShowToast1] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [segmentOn, setSegmentOn] = useState("challenge");
  const [errorToast, setErrorToast] = useState();
  const [step, setStep] = useState({
    points: 100,
    answerType: 0,
    validateAnswer: false,
    clue: null,
    wrongResponseTitle: "Oh, that's wrong!",
    wrongResponseAdditionalInfo: "But don't worry, and keep going!",
    succesResponseTitle: "Congratulations!",
    succesResponseAdditionalInfo: "This answer is correct!",
    hidden: false,
    visible: false,
    color: "",
    waitingTime: 60,
  });
  useEffect(() => {
    if (props.edit) setStep(props.edit);
  }, []);

  const RenderSegment = () => {
    switch (segmentOn) {
      case "challenge":
        return <Challenge step={step} setStep={setStep} />;
      case "misc":
        return <Misc step={step} setStep={setStep} />;
      case "response":
        return <Response step={step} setStep={setStep} />;
      default:
        break;
    }
  };
  const validateStep = (step) => {
    let errors = "";
    if (!step.clue || step.clue.length < 3)
      errors += "Clue can't be less than 3 characters long.";
    if (step.answerType < 2 && !step.code && !step.freeAnswer)
      errors += "\n If the answer is not an image you need to set an response.";
    if ((step.hidden || step.visible) && !step.coords)
      errors += "\n You need to specify location, if hidden or visible.";
    if (!(step.hidden || step.visible) && step.coords)
      errors += "\n You need to specify if this challenge hidden or visible.";
    return errors;
  };

  const saveNewStep = () => {
    let errors = validateStep(step);
    if (errors.length === 0) {
      if (!props.dashboard) {
        if (props.edit) {
          let steps = state.steps;
          steps.forEach((element, i) => {
            if (element.id === step.id) steps[i] = step;
          });
          dispatch({
            type: "setSteps",
            steps,
          });
        } else {
          //this is for create
          dispatch({
            type: "addStep",
            step: { ...step, id: Date.now() },
          });
          setShowToast1(true);
        }
      } else {
        props.addFromDashboard(step);
        props.handleClose();
      }

      props.handleClose();
    } else setErrorToast(errors);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton
            shape="round"
            color="danger"
            onClick={props.handleClose}
            className="ion-padding-horizontal"
          >
            X
          </IonButton>
          <IonButton
            shape="round"
            shape="round"
            shape="round"
            onClick={saveNewStep}
            color="success"
          >
            Save!
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSegment
          value={segmentOn}
          color="primary"
          onIonChange={(x) => setSegmentOn(x.detail.value)}
        >
          <IonSegmentButton value="challenge">
            <IonLabel>Challenge</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="misc">
            <IonLabel>Misc</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="response">
            <IonLabel>Feedback</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {RenderSegment()}
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
      <IonToast
        color="danger"
        position="top"
        isOpen={errorToast !== undefined}
        onDidDismiss={() => setErrorToast()}
        message={errorToast}
        duration={2000}
      />
    </>
  );
}
