import React from 'react'
import { IonHeader, IonToolbar, IonTitle, IonLabel, IonGrid, IonRow, IonCol, IonCardContent, IonCard, IonButton, IonIcon } from '@ionic/react'
import { close } from "ionicons/icons"
var moment = require('moment');

export default function LeaderBoard(props) {
	console.log(props.teams)
	return (
		<>
			<IonToolbar>

				<IonHeader ion-no-padding color="light">
					<IonButton onclick={props.handleClose}>
						<IonIcon icon={close} ></IonIcon></IonButton>

					<IonTitle className="ion-text-center " color="primary">
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
									{x.points || 0}
								</IonLabel>
							</IonCol>
							<IonCol>
								<IonLabel>
									{x.completed ? moment(x[x.completed[x.completed.length - 1]].time.seconds).format("HH:mm:ss") : "N/A"}
								</IonLabel>
							</IonCol>
						</IonRow>
					</IonCardContent></IonCard>
				))}
			</IonGrid>
		</>
	)
}
