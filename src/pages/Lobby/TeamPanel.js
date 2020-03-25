import React, { Fragment } from 'react'
import { IonCardTitle, IonCardContent, IonCard, IonButton, IonLabel, IonList, IonItem, IonCardHeader } from '@ionic/react'
import { UserService } from '../../services/UserSerivce'
import { LobbyService } from '../../services/LobbyService'

export default function TeamPanel(props) {
    console.log("rEnder panel", props.team)
    console.log("can join", props.canJoin)
    return (
        <>
            {
                props.team && <IonCard>

                    <IonCardContent >
                        <IonCardHeader>
                            <IonCardTitle>
                                {props.team.name}
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonList color="tertiary" className="ion-no-padding">
                            {props.team.players.map((x, index) => <IonItem color="tertiary" key={props.team.players[index]}>
                                {x}
                            </IonItem>)}
                        </IonList>
                        {!props.team.players.filter(x => x === UserService.getCurrentPlayer().name).length > 0 ?
                            <IonButton color="primary" expand="full" disabled={props.canJoin || props.team.length / props.max === 1} onClick={() => props.joinTeam(props.team.name)}>
                                Join!
                    </IonButton> :
                            <IonButton disabled="false" expand="full" color="danger" onClick={() => props.leaveTeam(LobbyService.getCurrentLobby(), UserService.getCurrentPlayer().name, props.team.name)}>Leave!</IonButton>
                        }
                    </IonCardContent>
                </IonCard >
            }
        </>
    )
}
