import React from 'react'
import { IonItem, IonContent, IonCol, IonItemDivider } from '@ionic/react'
import "./Lobby.scss"

export default function TeamsContainer(props) {

    return (
        <IonContent>
            <h3>Teams</h3>

            {props.teams.map(x =>
                <>
                    <IonItem detail lines="none" color="tertiary" button onClick={() => props.showThisTeam(x.name)}>

                        <IonCol size="8">
                            <h4>{x.name}</h4>
                        </IonCol>
                        <IonCol size="3">

                            <h5>4/5
                            </h5>
                        </IonCol>

                    </IonItem>
                    <IonItemDivider lines="none"></IonItemDivider>
                </>
            )
            }
        </IonContent >
    )
}
