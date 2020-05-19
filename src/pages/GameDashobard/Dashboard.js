import "./Dashboard.scss";

import {
  IonCol,
  IonGrid,
  IonLabel,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import DasboardApprove from "./DasboardApprove";
import DashboardGame from "./DashboardGame";
import { DashboardService } from "../../services/DashboardService";
import DashboardTeams from "./DashboardTeams";
import { LobbyService } from "../../services/LobbyService";
import { LocalNotifications } from "@ionic-native/local-notifications";
import useTeamChanges from "../../services/CustomHooks/useTeamChanges";

var moment = require("moment");

function DashboardSegmentPicker(props) {
  switch (props.value) {
    case "teams":
      return <DashboardTeams {...props} />;
    case "approve":
      return <DasboardApprove {...props} />;
    case "game":
      return <DashboardGame {...props} />;
    default:
      return <DasboardApprove {...props} />;
  }
}

export default function Dashboard(props) {
  const teams = useTeamChanges(LobbyService.getCurrentLobby());
  const [toBeValidated, setToBeValidated] = useState();
  const [showToast1, setShowToast1] = useState();

  let toBeValidatedOldLength = 0;
  useEffect(() => {
    props.game &&
      setToBeValidated(
        DashboardService.getToBeValidated(teams, props.game.steps)
      );
  }, [teams]);

  const [segmentOn, setSegmentOn] = useState("approve");

  const notify = () => {
    LocalNotifications.schedule({
      id: 1,
      text: "You need to approve a new challenge!",
    });
    setShowToast1("You need to approve a new challenge!");
  };
  useEffect(() => {
    if (toBeValidated && toBeValidated.length > toBeValidatedOldLength)
      notify();
    toBeValidatedOldLength = toBeValidated ? toBeValidated.length : 0;
  }, [toBeValidated]);

  return (
    <>
      <IonGrid>
        <IonRow className="ion-padding-top">
          <IonCol sizeXl="6" offsetXl="3">
            <IonSegment
              value={segmentOn}
              color="primary"
              onIonChange={(x) => setSegmentOn(x.detail.value)}
            >
              <IonSegmentButton value="teams">
                <IonLabel>Teams</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="approve">
                <IonLabel>
                  Approve ({toBeValidated && toBeValidated.length})
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="game">
                <IonLabel>Game</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonCol>
          <IonCol sizeXl="6" offsetXl="3">
            <DashboardSegmentPicker
              value={segmentOn}
              teams={teams}
              game={props.game}
              toBeValidated={toBeValidated}
              notify={notify}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonToast
        isOpen={showToast1 !== undefined}
        onDidDismiss={() => setShowToast1()}
        message={showToast1}
        duration={2000}
        position="top"
        color="light"
        mode="ios"
      />
    </>
  );
}
