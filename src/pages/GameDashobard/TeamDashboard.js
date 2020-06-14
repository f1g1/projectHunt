import "./Dashboard.scss";

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPopover,
  IonRow,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import AnswerModal from "./AnswerModal";
import CloseIcon from "@material-ui/icons/Close";
import { DashboardService } from "../../services/DashboardService";
import { PlayService } from "../../services/PlayService";

var moment = require("moment");

export default function TeamDashboard(props) {
  const [completed, setCompleted] = useState([]);
  const [active, setActive] = useState([]);
  const [adjustment, setAdjustment] = useState({ reason: "", value: 0 });
  const [showPopover, setShowPopover] = useState(false);
  const [finished, setFinished] = useState();
  const [errorToast, setErrorToast] = useState();
  const [showAnswerModal, setShowAnswerModal] = useState();

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
    let index = props.team.adjustments ? props.team.adjustments.length : 0;
    DashboardService.adjustPoints(props.team, { ...adjustment, index });
  };
  const handleAdjustmentChange = (value) => {
    if (
      value.includes("e") ||
      (value.includes("-") && value.indexOf("-") !== 0)
    ) {
      setErrorToast("Invalid number!");
      setAdjustment();
    } else {
      setAdjustment({ ...adjustment, value });
    }
  };
  const handleSeeShowAnswer = (x) => {
    console.log(x);
    setShowAnswerModal(x);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary" className="ion-text-center">
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <IonButton
            shape="round"
            color="danger"
            onClick={props.handleClose}
            className="ion-padding-start ion-float-left"
          >
            X
          </IonButton> */}
            <IonButtons style={{ display: "inline-block" }}>
              <IonButton shape="round" onclick={props.handleClose}>
                <CloseIcon />
              </IonButton>
            </IonButtons>
            <IonTitle
              // className="ion-padding-top"
              style={{ display: "inline-block" }}
            >
              Manage team: {props.team.name}
            </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
          <IonCol size="4">
            <IonItem>
              <IonLabel>
                Challenges:{" "}
                <p>
                  {PlayService.getChallengesPoints(props.team, props.game)}{" "}
                  points{" "}
                </p>
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
                onIonChange={(e) => handleAdjustmentChange(e.target.value)}
              ></IonInput>
              <IonButton shape="round" shape="round" onClick={handleAdjustment}>
                Adjust
              </IonButton>
            </IonItem>
          </IonCol>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <IonButton
                  shape="round"
                  shape="round"
                  onClick={() => setShowPopover(true)}
                >
                  See Adjustments
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonRow>
        <IonToolbar color="primary">
          <IonTitle>Completed Challenges</IonTitle>
        </IonToolbar>

        <IonCard color="light">
          <IonRow className="ion-padding">
            <IonCol className="ion-no-padding" sizeXl="4">
              <IonLabel>Clue:</IonLabel>
            </IonCol>
            <IonCol className="ion-no-padding" sizeXl="3">
              <IonLabel>Points</IonLabel>
            </IonCol>
            <IonCol className="ion-no-padding" sizeXl="3">
              <IonLabel>Date/Time</IonLabel>
            </IonCol>
            <IonCol className="ion-no-padding" sizeXl="2">
              <IonLabel></IonLabel>
            </IonCol>{" "}
          </IonRow>
        </IonCard>

        {completed.length ? (
          completed.map((x) => (
            <IonCard>
              <IonCardContent>
                <IonRow className="ion-no-padding">
                  <IonCol className="ion-no-padding" sizeXl="4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <IonLabel
                        color={
                          props.team.failed &&
                          props.team.failed.includes(x.id) &&
                          "danger"
                        }
                      >
                        Challenge #{x.index + 1}
                        <p>{x.hidden && " (hidden)"}</p>
                        <p color="danger">
                          {props.team.failed &&
                            props.team.failed.includes(x.id) &&
                            "failed!"}
                        </p>
                      </IonLabel>
                    </div>
                  </IonCol>
                  <IonCol className="ion-no-padding" sizeXl="3">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <IonLabel>{x.points}</IonLabel>
                    </div>
                  </IonCol>
                  <IonCol className="ion-no-padding" sizeXl="3">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <IonLabel>
                        {x.time &&
                          moment(x.time.seconds * 1000).format("DD/MM HH:mm")}
                      </IonLabel>
                    </div>
                  </IonCol>
                  <IonCol className="ion-no-padding" sizeXl="2">
                    <IonButton
                      shape="round"
                      shape="round"
                      onClick={() => handleSeeShowAnswer(x)}
                    >
                      See answer!
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <IonLabel>
            <p style={{ fontSize: "1.5em" }} className="ion-padding">
              There are no completed challenges!
            </p>
          </IonLabel>
        )}
        <IonToolbar color="primary" className="ion-margin-top">
          <IonTitle>Active Challenges</IonTitle>
        </IonToolbar>
        <IonCard color="light">
          <IonRow className="ion-padding">
            <IonCol className="ion-no-padding" size="4">
              <IonLabel>Clue:</IonLabel>
            </IonCol>
            <IonCol className="ion-no-padding" size="4">
              <IonLabel>Points</IonLabel>
            </IonCol>
            <IonCol className="ion-no-padding" size="4">
              <IonLabel></IonLabel>
            </IonCol>
          </IonRow>
        </IonCard>

        {active && active.length ? (
          active.map((x) => (
            <IonCard>
              <IonCardContent>
                <IonRow className="ion-no-padding">
                  <IonCol className="ion-no-padding" size="4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <IonLabel>
                        Challenge #{x.index + 1}
                        <p>{x.hidden && " (hidden)"}</p>
                      </IonLabel>
                    </div>
                  </IonCol>
                  <IonCol className="ion-no-padding" size="4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <IonLabel>{x.points}</IonLabel>
                    </div>
                  </IonCol>

                  <IonCol
                    className="ion-no-padding"
                    sizeXl="2"
                    offsetXl="2"
                    size="3"
                    offset="1"
                  >
                    <IonButton
                      shape="round"
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
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <IonLabel>
            <p style={{ fontSize: "1.5em" }} className="ion-padding">
              There are no active challenges!
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
          <>
            <IonCard color="light">
              <IonCardContent>
                <IonRow>
                  <IonCol size="8">
                    <IonLabel>Reason:</IonLabel>
                  </IonCol>
                  <IonCol size="2">
                    <IonLabel>Points:</IonLabel>
                  </IonCol>
                  <IonCol size="1"></IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>

            {props.team.adjustments.map((adjustment, i) => (
              <IonCard>
                <IonCardContent>
                  <IonRow
                    key={adjustment.reason + i}
                    className="ion-no-padding"
                  >
                    <IonCol size="8" className="ion-no-padding">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        {adjustment.reason ? (
                          <IonLabel>{adjustment.reason}</IonLabel>
                        ) : (
                          <IonLabel>No reason given!</IonLabel>
                        )}
                      </div>
                    </IonCol>
                    <IonCol size="2" className="ion-no-padding">
                      <IonLabel className="ion-text-center ">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          {adjustment.value}
                        </div>
                      </IonLabel>
                    </IonCol>

                    <IonCol size="2" className="ion-no-padding">
                      <IonButton
                        shape="round"
                        color="danger"
                        onClick={() =>
                          DashboardService.deleteAdjustment(
                            props.team,
                            adjustment
                          )
                        }
                      >
                        X
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        ) : (
          <IonTitle className="ion-padding ion-text-center">
            There are no adjustments set!
          </IonTitle>
        )}
      </IonPopover>
      <IonToast
        color="danger"
        position="top"
        isOpen={errorToast !== undefined}
        onDidDismiss={() => setErrorToast()}
        message={errorToast}
        duration={2000}
      />
      <IonModal
        isOpen={showAnswerModal !== undefined}
        onDidDismiss={() => setShowAnswerModal()}
      >
        <AnswerModal
          handleClose={() => setShowAnswerModal()}
          team={props.team}
          step={showAnswerModal}
        />
      </IonModal>
    </>
  );
}
