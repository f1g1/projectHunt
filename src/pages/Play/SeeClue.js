import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { PlayService } from "../../services/PlayService";
import SeeClueChallenge from "./SeeClueChallenge";
import SeeClueSucces from "./SeeClueSucces";
import SeeClueWrong from "./SeeClueWrong";
import moment from "moment";

export default function SeeClue(props) {
  const [status, setStatus] = useState(props.status || 0);
  const [step, setStep] = useState();
  const [timer, setTimer] = useState();

  useEffect(() => {
    debugger;
    if (props.status && props.status !== status) setStatus(props.status);
  });

  const startTimer = () => {
    let timerr = PlayService.getTimeOut(props.step).diff(Date.now());
    timerr -= 1000;
    const c = setInterval(() => {
      console.log(timerr);
      if (timerr <= 0) clearInterval(c);
      setTimer(moment.utc(timerr).format("mm:ss"));
      timerr -= 1000;
    }, 1000);
  };
  const handleSuccesScreen = () => {
    setStatus(1);
  };
  const handleWrong = () => {
    setStatus(2);
    PlayService.setTimeOut(step, 0.3);
    handleTimeout();
  };
  const handleSuccesOk = () => {
    props.handleClose();
  };
  const handleTimeout = () => {
    PlayService.getTimeOut(props.step) &&
      console.log(
        "hanlde Timeout",
        PlayService.getTimeOut(props.step).diff(Date.now())
      );
    if (PlayService.getTimeOut(props.step) && status != 2) {
      setStatus(2);
      setTimeout(function () {
        setStatus(0);
        PlayService.deleteTimeOut(props.step);
      }, PlayService.getTimeOut(props.step).diff(Date.now()));
      setTimer(
        moment
          .utc(PlayService.getTimeOut(props.step).diff(Date.now()))
          .format("mm:ss")
      );
      startTimer();
    }
  };

  useEffect(() => {
    handleTimeout();
    setStep(props.step);
    console.log("completed", props.completed);
  }, []);
  const handleStatus = () => {
    switch (status) {
      case 0:
        return (
          <SeeClueChallenge
            step={step}
            team={props.team}
            finished={props.finished}
            handleSucces={handleSuccesScreen}
            handleWrong={handleWrong}
          />
        );
      case 1:
        return <SeeClueSucces step={step} handleSucces={handleSuccesOk} />;
      case 2:
        return <SeeClueWrong step={props.step} timer={timer} />;
      default:
        break;
    }
  };
  return (
    <>
      <IonHeader>
        <IonToolbar color={status !== 2 ? "primary" : "danger"}>
          <IonButtons>
            <IonButton onclick={props.handleClose} color="danger">
              X
            </IonButton>
            <IonLabel className="ion-padding-start">
              Challenge #{props.step.index + 1}
            </IonLabel>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel className="ion-text-center">
          {status == 0 && (
            <p>
              {props.step.answerType === 0 && "(type your answer)"}
              {props.step.answerType === 1 && "(scan the qr)"}
              {props.step.answerType === 2 && "(take a photo)"}
            </p>
          )}
        </IonLabel>
        {handleStatus()}
      </IonContent>
    </>
  );
}
