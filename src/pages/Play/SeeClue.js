import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import CloseIcon from "@material-ui/icons/Close";
import { PlayService } from "../../services/PlayService";
import SeeClueChallenge from "./SeeClueChallenge";
import SeeClueSucces from "./SeeClueSucces";
import SeeClueWrong from "./SeeClueWrong";
import moment from "moment";

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
    if (props.activeWaitings && props.myTeam && getCurrentWaiting()) {
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

  const handleDelay = () => {
    // if (!props.step.freeAnswer && !props.step.needsValidation)
    return (
      status == 0 &&
      !props.step.freeAnswer &&
      !props.step.needsValidation &&
      (!props.step.onlyOnce ? (
        <IonLabel className="ion-text-center">
          {props.step.waitingTime ? (
            <p>
              Wrong answer delay{" "}
              {props.step.waitingTime
                ? moment.utc(props.step.waitingTime * 1000).format("mm:ss")
                : 0}
            </p>
          ) : (
            <p>--</p>
          )}
        </IonLabel>
      ) : (
        <IonLabel color="danger" className="ion-text-center">
          <p>Careful, you have only 1 chance to respond!</p>
        </IonLabel>
      ))
    );
  };

  const handleStatus = () => {
    switch (status) {
      case 0:
        return (
          <SeeClueChallenge
            offline={props.offline}
            step={props.step}
            team={props.team}
            finished={props.finished}
            handleSucces={handleSuccesScreen}
            handleWrong={handleWrong}
            handleClose={props.handleClose}
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
        <IonToolbar color={status != 2 ? "primary" : "danger"}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <IonButton
              shape="round"
              color="danger"
              onClick={props.handleClose}
              className="ion-margin-start ion-float-left"
              style={{ display: "inline-block" }}
            >
              X
            </IonButton> */}
            <IonButtons style={{ display: "inline-block" }}>
              <IonButton shape="round" onclick={props.handleClose}>
                <CloseIcon />
              </IonButton>
            </IonButtons>
            <IonTitle style={{ display: "inline-block" }}>
              Challenge #{props.step.index + 1}
              {props.offline && (
                <IonLabel
                  color="danger"
                  style={{ display: "inline-block" }}
                  className="ion-padding-horizontal ion-text-center"
                >
                  <p className="ion-text-center">Offline!</p>
                </IonLabel>
              )}
            </IonTitle>
          </div>
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
          {handleDelay()}
        </IonLabel>
        {handleStatus()}
      </IonContent>
    </>
  );
}
