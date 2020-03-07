import React from 'react'
import { IonItem, IonContent, IonCol, IonItemDivider, IonButton, IonList } from '@ionic/react'
import "./Lobby.scss"
import { UserService } from '../../services/UserSerivce'

export default function TeamsContainer(props) {

    return (
        <IonContent>
            <h3>Teams</h3>

            {props.teams.map(x =>
                <IonList>

                    <IonItem detail lines="none" color="tertiary" button onClick={() => props.showThisTeam(x.name)}>

                        <IonCol size="6">
                            <h4>{x.name}</h4>
                        </IonCol>
                        <IonCol size="2">

                            <h5>{x.members.length}/{props.max}
                            </h5>
                        </IonCol>
                        <IonCol>
                            {x.members.length === props.max ? (
                                <IonButton disabled color="danger">
                                    full team
                                </IonButton>)
                                : (
                                    <IonButton onClick={() => props.addPlayer(x.name, UserService.getCurrentUser())}>join</IonButton>)
                            }
                        </IonCol>

                    </IonItem>
                </IonList >
            )
            }
        </IonContent >
    )
}
