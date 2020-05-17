import "./Dashboard.scss";

import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { DashboardService } from "../../services/DashboardService";
import { PlayService } from "../../services/PlayService";

var moment = require("moment");

export default function TeamDashboard(props) {
  const [completed, setCompleted] = useState([]);
  const [active, setActive] = useState([]);
  const [adjustment, setAdjustment] = useState({ reason: "", value: 0 });
  const [showPopover, setShowPopover] = useState(false);
  const [finished, setFinished] = useState();

  useEffect(() => {
    setActive(
      PlayService.getAllActiveSteps(props.game, props.team.name, [props.team])
    );
    setCompleted(
      PlayService.getCompletedSteps(props.game, props.team.name, [props.team])
    );
    let teamFinished =
      props.team.completed &&
      props.team.completed.length >= props.game.steps.length - 1;
    setFinished(teamFinished);
  }, [props.team]);

  const handleAdjustment = () => {
    DashboardService.adjustPoints(props.team, adjustment);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="tertiary" className="ion-text-center">
          <IonButton
            color="danger"
            onClick={props.handleClose}
            className="ion-padding-start ion-float-left"
          >
            X
          </IonButton>
          <IonTitle className="ion-padding-top">
            Manage team: {props.team.name}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
          <IonCol size="4">
            <IonItem>
              <IonLabel>
                Challenges:{" "}
                <p>{completed.reduce((t, x) => (t += x.points), 0)} points </p>
              </IonLabel>
            </IonItem>
          </IonCol>
          <IonCol size="4">
            <IonItem>
              <IonLabel>
                Adjusting:{" "}
                <p>{PlayService.getAdjustmentPoints(props.team)} points </p>
              </IonLabel>
            </IonItem>
          </IonCol>
          <IonCol size="4">
            <IonItem>
              <IonLabel>
                Total:{" "}
                <p>
                  {PlayService.getTotalPoints(props.team, props.game)} points{" "}
                </p>
              </IonLabel>
            </IonItem>
          </IonCol>
          <IonCol size="12">
            <IonItem lines="none">
              <IonLabel>Adjust reason:</IonLabel>
              <IonInput
                type="text"
                value={adjustment.reason}
                onIonChange={(e) =>
                  setAdjustment({ ...adjustment, reason: e.target.value })
                }
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Adjust points:</IonLabel>
              <IonInput
                type="number"
                value={adjustment.value}
                onIonChange={(e) =>
                  setAdjustment({ ...adjustment, value: e.target.value })
                }
              ></IonInput>
              <IonButton onClick={handleAdjustment} color="tertiary">
                Adjust
              </IonButton>
            </IonItem>
          </IonCol>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <IonButton onClick={() => setShowPopover(true)} color="tertiary">
                Adjustments
              </IonButton>
            </IonCol>
          </IonRow>
        </IonRow>
        <IonToolbar color="tertiary">
          <IonTitle>Completed Challenges</IonTitle>
        </IonToolbar>

        <IonItem>
          <IonLabel>Clue:</IonLabel>
          <IonLabel>Points</IonLabel>
          <IonLabel>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date/Time
          </IonLabel>
          <IonLabel></IonLabel>
        </IonItem>
        {completed.length ? (
          completed.map((x) => (
            <IonItem>
              <IonLabel>
                Challenge #{x.index + 1}
                <p>{x.hidden && " (hidden)"}</p>
              </IonLabel>
              <IonLabel>{x.points}</IonLabel>
              <IonLabel>
                {x.time && moment(x.time.seconds * 1000).format("DD/MM HH:mm")}
              </IonLabel>
              <IonButton
                color="danger"
                onClick={() =>
                  DashboardService.revokeChallenge(props.team.name, x)
                }
              >
                Revoke!
              </IonButton>
            </IonItem>
          ))
        ) : (
          <IonLabel>
            <p style={{ fontSize: "1.5em" }} className="ion-padding">
              There are no completed challenges!
            </p>
          </IonLabel>
        )}
        <IonToolbar color="tertiary" className="ion-margin-top">
          <IonTitle>Active Challenges</IonTitle>
        </IonToolbar>
        <IonItem>
          <IonLabel>Clue:</IonLabel>
          <IonLabel>Points</IonLabel>
          <IonLabel></IonLabel>
        </IonItem>

        {active && active.length ? (
          active.map((x) => (
            <IonItem>
              <IonLabel>
                Challenge #{x.index + 1}
                <p>{x.hidden && " (hidden)"}</p>
              </IonLabel>
              <IonLabel>{x.points}</IonLabel>
              <IonButton
                onClick={() =>
                  DashboardService.completeChallenge(
                    props.team.name,
                    x,
                    finished
                  )
                }
              >
                Complete!
              </IonButton>
            </IonItem>
          ))
        ) : (
          <IonLabel>
            <p style={{ fontSize: "1.5em" }} className="ion-padding">
              There are no active challenges remaining, all challenges are
              completed
            </p>
          </IonLabel>
        )}
      </IonContent>
      <IonPopover
        isOpen={showPopover}
        onDidDismiss={(e) => setShowPopover(false)}
        width="70%"
        className="adjustmentPopover"
        style={{ minWidth: "300px" }}
      >
        {props.team.adjustments && props.team.adjustments.length ? (
          props.team.adjustments.map((adjustment) => (
            <IonRow>
              <IonCol>
                <IonLabel>{adjustment.reason}</IonLabel>
              </IonCol>
              <IonLabel className="ion-text-center ion-padding">
                <p>{adjustment.value}</p>
              </IonLabel>
              <IonButton
                color="danger"
                onClick={() =>
                  DashboardService.deleteAdjustment(props.team, adjustment)
                }
              >
                X
              </IonButton>
            </IonRow>
          ))
        ) : (
          <IonTitle className="ion-padding ion-text-center">
            There are no adjustments set!
          </IonTitle>
        )}
      </IonPopover>
    </>
  );
}
