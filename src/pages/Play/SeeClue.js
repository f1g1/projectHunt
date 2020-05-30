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

export default function SeeClue(props) {
  const [status, setStatus] = useState(props.status || 0);
  const [currentWaiting, setCurrentWaiting] = useState();

  useEffect(() => {
    if (props.status && props.status !== status) setStatus(props.status);
  });

  let getCurrentWaiting = () => {
    if (props.myTeam && props.myTeam.waitList) {
      let currentWaitingSteps = props.myTeam.waitList.filter(
        (x) => x.step === props.step.id
      );
      let activeWaiting = currentWaitingSteps.filter(
        (x) => x.expires > Date.now()
      );
      return activeWaiting;
    }
  };

  useEffect(() => {
    if (props.activeWaitings && props.myTeam) {
      let thisStep = getCurrentWaiting().find((x) => true);
      if (thisStep) {
        setStatus(2);
        setCurrentWaiting(thisStep.expires - Date.now());
        startTimer(thisStep);
      }
    }
  }, [props.activeWaitings]);

  const startTimer = (thisStep) => {
    let timerr = thisStep.expires - Date.now();
    timerr -= 1000;
    const c = setInterval(() => {
      if (timerr <= 0) clearInterval(c);
      setCurrentWaiting(timerr);
      timerr -= 1000;
    }, 1000);
  };
  const handleSuccesScreen = () => {
    setStatus(1);
  };
  const handleWrong = () => {
    setStatus(2);
    PlayService.setTimeOut(props.step, props.team);
  };
  const handleSuccesOk = () => {
    props.handleClose();
  };

  const handleStatus = () => {
    switch (status) {
      case 0:
        return (
          <SeeClueChallenge
            step={props.step}
            team={props.team}
            finished={props.finished}
            handleSucces={handleSuccesScreen}
            handleWrong={handleWrong}
          />
        );
      case 1:
        return (
          <SeeClueSucces step={props.step} handleSucces={handleSuccesOk} />
        );
      case 2:
        return (
          <SeeClueWrong
            step={props.step}
            timer={currentWaiting}
            ok={() => setStatus(0)}
          />
        );
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
