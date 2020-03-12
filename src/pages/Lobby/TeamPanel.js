import React from 'react'
import { IonCardTitle, IonCardContent, IonCard, IonButton, IonLabel, IonList, IonItem } from '@ionic/react'
import { UserService } from '../../services/UserSerivce'
import { LobbyService } from '../../services/LobbyService'

export default function TeamPanel(props) {
    return (
        <>
            <h3>&nbsp;</h3>
            <IonCard color="tertiary">
                <IonCardTitle >
                    <IonLabel>
                        {props.team.name}
                    </IonLabel>
                </IonCardTitle>

                <IonCardContent color="tertiary">
                    <IonList color="tertiary" className="ion-no-padding">
                        {props.team.map(x => <IonItem color="tertiary">
                            {x.name}
                        </IonItem>)}
                    </IonList>


                    {!props.team.filter(x => x.name === UserService.getCurrentPlayer().name).length > 0 ?
                        <IonButton expand="full" disabled={props.team.length / props.max === 1} onClick={() => LobbyService.playerJoinTeam(LobbyService.getCurrentLobby(), props.team.name, UserService.getCurrentPlayer())}>
                            Join!
                    </IonButton> :
                        <IonButton expand="full" color="danger" onClick={() => props.leaveTeam()}>Leave!</IonButton>
                    }
                </IonCardContent>
            </IonCard>
        </>)
}
