import React, { Fragment } from 'react'
import { IonCardTitle, IonCardContent, IonCard, IonButton, IonLabel, IonList, IonItem } from '@ionic/react'
import { UserService } from '../../services/UserSerivce'
import { LobbyService } from '../../services/LobbyService'

export default function TeamPanel(props) {
    return (
        <Fragment>
            <h3>&nbsp;</h3>
            <IonCard color="tertiary">
                <IonCardTitle >
                    <IonLabel>
                        {props.team.name}
                    </IonLabel>
                </IonCardTitle>

                <IonCardContent color="tertiary">
                    <IonList color="tertiary" className="ion-no-padding">
                        {props.team.players.map((x, index) => <IonItem color="tertiary" key={props.team.players[index]}>
                            {x}
                        </IonItem>)}
                    </IonList>
                    {!props.team.players.filter(x => x === UserService.getCurrentPlayer().name).length > 0 ?
                        <IonButton expand="full" disabled={props.team.length / props.max === 1} onClick={() => LobbyService.playerJoinTeam(LobbyService.getCurrentLobby(), props.team.name, UserService.getCurrentPlayer().name)}>
                            Join!
                    </IonButton> :
                        <IonButton expand="full" color="danger" onClick={() => props.leaveTeam(LobbyService.getCurrentLobby(), UserService.getCurrentPlayer().name, props.team.name)}>Leave!</IonButton>
                    }
                </IonCardContent>
            </IonCard>
        </Fragment>)
}
