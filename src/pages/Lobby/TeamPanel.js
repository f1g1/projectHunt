import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList } from '@ionic/react';

import { LobbyService } from '../../services/LobbyService';
import PlayerTag from "./PlayerTag";
import React from 'react';
import { UserService } from '../../services/UserSerivce';

export default function TeamPanel(props) {
    console.log("props. game", props.game)
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
                            {props.team.players.map((x, index) =>
                                <PlayerTag team={props.team} player={props.team.players[index]} game={props.game} key={props.team.players[index]} />)}

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
