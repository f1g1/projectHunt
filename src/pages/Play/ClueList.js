import {
  IonChip,
  IonCol,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonThumbnail,
  IonTitle,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { PlayService } from "../../services/PlayService";
import SeeClue from "./SeeClue";

const showStatus = {
  ACTIVE: 0,
  COMPLETED: 1,
};
export default function ClueList(props) {
  const [filtered, setFiltered] = useState([]);
  const [showClueModal, setShowClueModal] = useState(false);
  const [clueInfo, setClueInfo] = useState();
  const [showSteps, setShowSteps] = useState(0);
  const [finished, setfinished] = useState(false);
  const hanldeStepClick = (id) => {
    if (
      !props.myTeam.toBeValidated ||
      !props.myTeam.toBeValidated.find((z) => z === id)
    ) {
      setShowClueModal(true);
      let status;
      if (showStatus.COMPLETED == showSteps) status = 1;
      setClueInfo({
        step: props.game.steps.find((x) => x.id === id),
        team: props.myTeam.name,
        status: status,
      });
    }
  };

  useEffect(() => {
    props.teams.length > 0 &&
      props.myTeam &&
      setFiltered(
        showSteps === showStatus.ACTIVE
          ? PlayService.getActiveSteps(
              props.game,
              props.myTeam.name,
              props.teams
            )
          : PlayService.getCompletedSteps(
              props.game,
              props.myTeam.name,
              props.teams
            )
      );
  }, [props.game]);

  useEffect(() => {
    let teamFinished =
      props.myTeam.completed &&
      props.myTeam.completed.length >= props.game.steps.length - 1;
    teamFinished && setfinished(teamFinished);
    props.myTeam &&
      setFiltered(
        showSteps === showStatus.ACTIVE
          ? PlayService.getActiveSteps(
              props.game,
              props.myTeam.name,
              props.teams
            )
          : PlayService.getCompletedSteps(
              props.game,
              props.myTeam.name,
              props.teams
            )
      );
  }, [props.teams]);

  useEffect(() => {
    props.teams.length > 0 &&
      setFiltered(
        showSteps === showStatus.ACTIVE
          ? PlayService.getActiveSteps(
              props.game,
              props.myTeam.name,
              props.teams
            )
          : PlayService.getCompletedSteps(
              props.game,
              props.myTeam.name,
              props.teams
            )
      );
  }, [showSteps]);

  return (
    <>
      <IonRow style={{ height: "100%" }}>
        <IonCol sizeLg={6} offsetLg={3}>
          <p className="ion-text-center">
            <IonChip
              outline={showSteps === showStatus.ACTIVE}
              onClick={() => setShowSteps(showStatus.ACTIVE)}
              mode="ios"
              color={showSteps !== showStatus.ACTIVE && "light"}
            >
              <IonLabel>Active!</IonLabel>
            </IonChip>
            <IonChip
              outline={showSteps === showStatus.COMPLETED}
              onClick={() => setShowSteps(showStatus.COMPLETED)}
              mode="ios"
              color={showSteps !== showStatus.COMPLETED && "light"}
            >
              <IonLabel>Completed!</IonLabel>
            </IonChip>
          </p>
          <IonTitle>
            {!showSteps
              ? `Active Challenges ${
                  props.teams.length > 0 && filtered && filtered[0]
                    ? filtered.length
                    : ""
                }`
              : `Completed Challenges ${filtered.length}`}
          </IonTitle>
          {filtered &&
            filtered.map((x, index) =>
              !x ? (
                <>
                  <IonTitle style={{ marginTop: "80px" }}>
                    Congratulations!!!
                    <br /> You have finished all the challenges!
                  </IonTitle>
                  <IonLabel>
                    <p
                      style={{ bottom: "40px" }}
                      className="ion-padding-horizontal"
                    >
                      psst, pssst, hey you, you may find some hidden challenges
                      if you check in in the places that you solved other
                      challenges
                    </p>
                  </IonLabel>
                </>
              ) : (
                <IonItem
                  button
                  onClick={() => hanldeStepClick(x.id)}
                  style={
                    showSteps === showStatus.COMPLETED ? { opacity: 0.6 } : {}
                  }
                  color={
                    props.myTeam.failed &&
                    props.myTeam.failed.find((z) => z === x.id) &&
                    "danger"
                  }
                  key={x.id}
                >
                  <IonThumbnail slot="start">
                    <img src={x.image} />
                  </IonThumbnail>
                  <IonLabel>
                    {props.myTeam.toBeValidated &&
                      props.myTeam.toBeValidated.find((z) => z === x.id) && (
                        <p style={{ float: "right" }}>Pending validation</p>
                      )}
                    <h2>#{x.index + 1}</h2>
                    {x.hidden && (
                      <IonLabel>
                        <p> (hidden)</p>
                      </IonLabel>
                    )}
                    <h3>{x.clue}</h3>
                    &nbsp;
                    {showSteps === showStatus.COMPLETED &&
                      //for text/qr we show the answer as label
                      props.myTeam[x.id] &&
                      (x.answerType < 2 ? (
                        <>
                          <h2 color="danger">Answer:</h2>

                          <IonLabel color="danger">
                            {props.myTeam[x.id].answer}
                          </IonLabel>
                        </>
                      ) : (
                        <IonThumbnail slot="end" className="ion-float-right">
                          <IonImg src={props.myTeam[x.id].imageAnswer}></IonImg>
                        </IonThumbnail>
                      ))}
                  </IonLabel>
                </IonItem>
              )
            )}
        </IonCol>
      </IonRow>
      <IonModal
        isOpen={showClueModal}
        onDidDismiss={() => setShowClueModal(false)}
      >
        <SeeClue
          myTeam={props.myTeam}
          teams={props.teams}
          handleClose={() => setShowClueModal(false)}
          game
          offline={props.offline}
          finished={finished}
          {...clueInfo}
          activeWaitings={props.myTeam}
        />
      </IonModal>
    </>
  );
}
