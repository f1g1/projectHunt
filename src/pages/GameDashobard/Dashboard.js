import "./Dashboard.scss";

import { IonBackButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { DashboardService } from "../../services/DashboardService";
import { LobbyService } from "../../services/LobbyService";
import { PlayService } from '../../services/PlayService';
import TeamDashboard from './TeamDashboard';
import useTeamChanges from '../../services/useTeamChanges';

var moment = require('moment');


export default function Dashboard(props) {
  const teams = useTeamChanges(LobbyService.getCurrentLobby())
  const [showTeamDashboard, setShowTeamDashboard] = useState(false)
  const [currentTeam, setCurrentTeam] = useState()
  const [game, setGame] = useState()
  useEffect(() => {
    debugger;
    setGame(PlayService.getGame())
  }, [teams])

  useEffect(() => {
    game && teams && console.log(DashboardService.getToBeValidated(teams, game.steps))
  })
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons style={{ display: "inline-block" }}>
              <IonBackButton defaultHref='/home'></IonBackButton>
            </IonButtons>
            <IonTitle style={{ display: "inline-block" }} >
              Dashboard
          </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid  >
            <IonRow className="ion-padding-top">
              <IonCol sizeXl="4" offsetXl="1" size="12">
                <IonTitle>
                  Teams related Dashobard
                </IonTitle>
                <IonCard color="light" style={{ marginBottom: "30px" }}>
                  <IonCardContent>
                    <IonRow color="priamry">
                      <IonCol>
                        <h2 style={{ textDecoration: "bold" }}>
                          Team</h2>
                      </IonCol>
                      <IonCol>
                        <IonLabel>
                          Completed
						</IonLabel>
                      </IonCol>
                      <IonCol>
                        <IonLabel>
                          Points
						</IonLabel>
                      </IonCol>
                      <IonCol>
                        <IonLabel>
                          Last Completed
						</IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonCardContent>
                </IonCard>

                {teams && teams.map((x, i) => (
                  <IonItem button onClick={() => { setCurrentTeam(i); setShowTeamDashboard(true) }} key={x.name} style={{ cursor: "pointer" }} >
                    <IonGrid>
                      <IonRow key={x.name} >
                        <IonCol>
                          {x.name}
                        </IonCol>
                        <IonCol>
                          <IonLabel>
                            {x.completed ? x.completed.length : 0}
                          </IonLabel>
                        </IonCol>
                        <IonCol>
                          <IonLabel>
                            {PlayService.getTotalPoints(x, game) || 0}
                          </IonLabel>
                        </IonCol>
                        <IonCol>
                          <IonLabel>
                            {x.completed && x[x.completed[x.completed.length - 1]] && x[x.completed[x.completed.length - 1]].time ? moment(x[x.completed[x.completed.length - 1]].time.seconds * 1000).format("DD/MM HH:mm") : "N/A"}
                          </IonLabel>
                        </IonCol>
                      </IonRow>
                    </IonGrid></IonItem>
                ))}
              </IonCol>

              <IonCol offsetXl="1" sizeXl="4" size="12">
                <IonTitle>To be Approved</IonTitle>
                <IonCard color="light" style={{ marginBottom: "30px" }}>
                  <IonCardContent>
                    <IonRow color="priamry">
                      <IonCol>
                        <h2 style={{ textDecoration: "bold" }}>
                          Team</h2>
                      </IonCol>
                      <IonCol>
                        <IonLabel>
                          challenge
						</IonLabel>
                      </IonCol>
                      <IonCol>
                        <IonLabel>
                          Timestamp
						</IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonCardContent>
                </IonCard>

                {game && DashboardService.getToBeValidated(teams, game.steps).map(x => (
                  <IonItem style={{ cursor: "pointer" }} >
                    <IonGrid>
                      <IonRow key={x.name} >
                        <IonCol>
                          {x.name}
                        </IonCol>
                        <IonCol>
                          <IonLabel>
                            #{x.index + 1}
                          </IonLabel>
                        </IonCol>
                        <IonCol>
                          <IonLabel>
                            {moment(x.time * 1000).format("DD/MM HH:mm")}
                          </IonLabel>
                        </IonCol>

                      </IonRow>
                    </IonGrid></IonItem>
                ))}



              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
      <IonModal
        className="adjustmentPopover"
        isOpen={showTeamDashboard}
        onDidDismiss={() => setShowTeamDashboard(false)}
      >
        {game &&
          <TeamDashboard
            handleClose={() => setShowTeamDashboard(false)}
            game={game}
            team={teams[currentTeam]}
            steps={game.steps} />}
      </IonModal>
    </>
  )
}
