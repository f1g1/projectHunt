import {
  IonCard,
  IonCardContent,
  IonCol,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import { PlayService } from "../../services/PlayService";
import TeamDashboard from "./TeamDashboard";

var moment = require("moment");

export default function Dashboardteams(props) {
  const [currentTeam, setCurrentTeam] = useState();
  const [showTeamDashboard, setShowTeamDashboard] = useState(false);
  useEffect(() => {
    if (currentTeam) {
      setCurrentTeam(props.teams.find((x) => x.name === currentTeam.name));
    }
  }, [props.teams]);

  return (
    <>
      <IonCard color="light" style={{ marginBottom: "30px" }}>
        <IonCardContent>
          <IonRow color="priamry">
            <IonCol>
              <h2 style={{ textDecoration: "bold" }}>Team:</h2>
            </IonCol>
            <IonCol>
              <IonLabel>Completed:</IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel>Points:</IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel>Last</IonLabel>
            </IonCol>
          </IonRow>
        </IonCardContent>
      </IonCard>

      {props.teams &&
        props.teams.map((x, i) => (
          <IonCard
            onClick={() => {
              setCurrentTeam(x);
              setShowTeamDashboard(true);
            }}
            key={x.name}
            style={{ cursor: "pointer" }}
            className="ion-no-padding"
            color="primary"
          >
            <IonCardContent>
              <IonRow key={x.name}>
                <IonCol>{x.name}</IonCol>
                <IonCol>
                  <IonLabel>{x.completed ? x.completed.length : 0}</IonLabel>
                </IonCol>
                <IonCol>
                  <IonLabel>
                    {PlayService.getTotalPoints(x, props.game) || 0}
                  </IonLabel>
                </IonCol>
                <IonCol>
                  <IonLabel>
                    {x.completed &&
                    x[x.completed[x.completed.length - 1]] &&
                    x[x.completed[x.completed.length - 1]].time
                      ? moment(
                          x[x.completed[x.completed.length - 1]].time.seconds *
                            1000
                        ).format("DD/MM HH:mm")
                      : "N/A"}
                  </IonLabel>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>
        ))}

      <IonModal
        className="adjustmentPopover"
        isOpen={showTeamDashboard}
        onDidDismiss={() => setShowTeamDashboard(false)}
      >
        {props.game && (
          <TeamDashboard
            handleClose={() => setShowTeamDashboard(false)}
            game={props.game}
            team={currentTeam}
            steps={props.game.steps}
          />
        )}
      </IonModal>
    </>
  );
}
