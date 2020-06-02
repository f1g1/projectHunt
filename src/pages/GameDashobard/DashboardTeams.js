import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
} from "@ionic/react";
import React, { useState } from "react";

import { PlayService } from "../../services/PlayService";
import TeamDashboard from "./TeamDashboard";

var moment = require("moment");

export default function Dashboardteams(props) {
  const [currentTeam, setCurrentTeam] = useState();
  const [showTeamDashboard, setShowTeamDashboard] = useState(false);
  const [currentTeamName, setCurrentTeamName] = useState();

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
              <IonLabel>Last Completed:</IonLabel>
            </IonCol>
          </IonRow>
        </IonCardContent>
      </IonCard>
      <IonCardContent className="ion-padding-none">
        {props.teams &&
          props.teams.map((x, i) => (
            <IonItem
              button
              onClick={() => {
                setCurrentTeam(i);
                setShowTeamDashboard(true);
              }}
              key={x.name}
              style={{ cursor: "pointer" }}
              color="tertiary"
            >
              <IonGrid>
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
                            x[x.completed[x.completed.length - 1]].time
                              .seconds * 1000
                          ).format("DD/MM HH:mm")
                        : "N/A"}
                    </IonLabel>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
      </IonCardContent>

      <IonModal
        className="adjustmentPopover"
        isOpen={showTeamDashboard}
        onDidDismiss={() => setShowTeamDashboard(false)}
      >
        {props.game && (
          <TeamDashboard
            handleClose={() => setShowTeamDashboard(false)}
            game={props.game}
            team={props.teams[currentTeam]}
            steps={props.game.steps}
          />
        )}
      </IonModal>
    </>
  );
}
