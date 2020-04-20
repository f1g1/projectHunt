import "./Dashboard.scss";

import { IonBackButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { PlayService } from '../../services/PlayService';
import TeamDashboard from './TeamDashboard';
import useTeamChanges from '../../services/useTeamChanges';

var moment = require('moment');


export default function Dashboard(props) {
  const teams = useTeamChanges(props.location.lobbyId)
  const [showTeamDashboard, setShowTeamDashboard] = useState(false)
  const [currentTeam, setCurrentTeam] = useState()
  const [game, setGame] = useState()
  useEffect(() => {
    debugger;
    setGame(PlayService.getGame())
  }, [teams])
  return (
    <>
      <IonPage>
        <IonToolbar color="primary">
          <IonBackButton defaultHref="/home" />
          <IonTitle >
            Dashboard
					</IonTitle>
        </IonToolbar>
        <IonContent>
          <IonGrid  >
            <IonRow className="ion-padding-top">
              <IonCol sizeXl="4" offsetXl="1">
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
