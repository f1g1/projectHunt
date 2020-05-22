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

import { LobbyService } from "../../services/LobbyService";
import { PlayService } from "../../services/PlayService";
import SeeClue from "./SeeClue";
import { UserService } from "../../services/UserSerivce";

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
  const [currentTeamObj, setCurrentTeamObj] = useState({});

  const hanldeStepClick = (id) => {
    if (
      !currentTeamObj.toBeValidated ||
      !currentTeamObj.toBeValidated.find((z) => z === id)
    ) {
      setShowClueModal(true);
      let status;
      if (showStatus.COMPLETED == showSteps) status = 1;
      setClueInfo({
        step: props.game.steps.find((x) => x.id === id),
        team: LobbyService.getCurrentTeam(),
        status: status,
      });
    }
  };
  useEffect(() => {
    props.teams.length > 0 &&
      LobbyService.getCurrentTeam() &&
      setFiltered(
        showSteps === showStatus.ACTIVE
          ? PlayService.getActiveSteps(
              props.game,
              LobbyService.getCurrentTeam(),
              props.teams
            )
          : PlayService.getCompletedSteps(
              props.game,
              LobbyService.getCurrentTeam(),
              props.teams
            )
      );
  }, [props.game]);

  useEffect(() => {
    props.teams.length &&
      setCurrentTeamObj(
        props.teams.find((y) => y.name === LobbyService.getCurrentTeam()) || {}
      );

    let teamFinished =
      currentTeamObj.completed &&
      currentTeamObj.completed.length >= props.game.steps.length - 1;
    teamFinished && setfinished(teamFinished);
  }, [props.teams]);

  useEffect(() => {
    if (!LobbyService.getCurrentTeam() && props.teams) {
      let myTeam = props.teams.filter((x) =>
        x.players.includes(UserService.getCurrentPlayer().name)
      );
      if (myTeam.length > 0) {
        LobbyService.setCurrentTeam(myTeam[0].name);
      }
    }
    console.log(props.teams);
    props.teams.length > 0 &&
      LobbyService.getCurrentTeam() &&
      setFiltered(
        showSteps === showStatus.ACTIVE
          ? PlayService.getActiveSteps(
              props.game,
              LobbyService.getCurrentTeam(),
              props.teams
            )
          : PlayService.getCompletedSteps(
              props.game,
              LobbyService.getCurrentTeam(),
              props.teams
            )
      );
  }, [props.teams]);
  useEffect(() => {
    props.teams.length > 0 &&
      LobbyService.getCurrentTeam() &&
      setFiltered(
        showSteps === showStatus.ACTIVE
          ? PlayService.getActiveSteps(
              props.game,
              LobbyService.getCurrentTeam(),
              props.teams
            )
          : PlayService.getCompletedSteps(
              props.game,
              LobbyService.getCurrentTeam(),
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
                    currentTeamObj.failed &&
                    currentTeamObj.failed.find((z) => z === x.id) &&
                    "danger"
                  }
                  key={x.id}
                >
                  <IonThumbnail slot="start">
                    <img src={x.image} />
                  </IonThumbnail>
                  <IonLabel>
                    {currentTeamObj.toBeValidated &&
                      currentTeamObj.toBeValidated.find((z) => z === x.id) && (
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
                      currentTeamObj[x.id] &&
                      (x.answerType < 2 ? (
                        <>
                          <h2 color="danger">Answer:</h2>

                          <IonLabel color="danger">
                            {currentTeamObj[x.id].answer}
                          </IonLabel>
                        </>
                      ) : (
                        <IonThumbnail slot="end" className="ion-float-right">
                          <IonImg
                            src={currentTeamObj[x.id].imageAnswer}
                          ></IonImg>
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
          handleClose={() => setShowClueModal(false)}
          game
          finished={finished}
          {...clueInfo}
        />
      </IonModal>
    </>
  );
}
