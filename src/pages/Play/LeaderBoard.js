import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonHeader, IonLabel, IonRow, IonTitle, IonToolbar } from '@ionic/react';

import { PlayService } from '../../services/PlayService';
import React from 'react';

var moment = require('moment');

export default function LeaderBoard(props) {
	console.log(props.teams)
	return (
		<>
			<IonToolbar color="primary">
				<IonHeader ion-no-padding >
					<IonButton onclick={props.handleClose} color="danger">X</IonButton>
					<IonTitle className="ion-text-center " >
						LeaderBoard
					</IonTitle>
				</IonHeader>
			</IonToolbar>
			<IonGrid fixed full>
				<IonCard color="light" style={{ marginBottom: "30px" }}>
					<IonCardContent>
						<IonRow color="priamry">
							<IonCol>
								<h2 style={{ textDecoration: "bold" }}>
									Team
						</h2>
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
				{props.teams && props.teams.map(x => (
					<IonCard><IonCardContent>
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
									{PlayService.getTotalPoints(x, props.game) || 0}
								</IonLabel>
							</IonCol>
							<IonCol>
								<IonLabel>
									{x.completed ? moment(x[x.completed[x.completed.length - 1]].time.seconds * 1000).format("DD/MM HH:mm") : "N/A"}

									{/* {x.completed ? moment(x[x.completed[x.completed.length - 1]].time.seconds).format("HH:mm:ss") : "N/A"} */}
								</IonLabel>
							</IonCol>
						</IonRow>
					</IonCardContent></IonCard>
				))}
			</IonGrid>
		</>
	)
}
