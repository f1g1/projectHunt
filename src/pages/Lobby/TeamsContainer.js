import React, { Fragment, useState } from 'react'
import { IonItem, IonContent, IonCol, IonItemDivider, IonButton, IonList, IonGrid, IonRow, IonBadge, IonIcon, IonInput } from '@ionic/react'
import "./Lobby.scss"
import { LobbyService } from '../../services/LobbyService'
import { UserService } from '../../services/UserSerivce'
export default function TeamsContainer(props) {
    const [newTeamName, setnewTeamName] = useState()
    const addTeam = () => {
        LobbyService.addTeam(LobbyService.getCurrentLobby(), newTeamName, UserService.getCurrentPlayer().name);
    }
    return (
        <IonContent>
            <h3>Teams</h3>
            <IonList>

                {props.teams && Object.entries(props.teams).map(([key, player], index) => {
                    return <Fragment key={player.team}>
                        <IonItem detail lines="none" color="tertiary" button onClick={() => props.showThisTeam(key)} key={player.team + index + "das"}>
                            <IonBadge color={player.length / props.max === 1 ? "danger" : "primary"}>
                                <h5>{player.length}/{props.max}</h5>
                            </IonBadge>

                            <h1>
                                {player[0].team}
                            </h1>


                        </IonItem>
                        <IonItemDivider key={player.teamName + index} />
                    </Fragment>
                })
                }
                <IonItem>
                    <IonInput placeholder="TeamName" maxlength="20" minlength="3" type="text" value={newTeamName} onIonChange={(e) => setnewTeamName(e.detail.value)}></IonInput>
                    <IonButton onClick={addTeam}>Add new team</IonButton>

                </IonItem>

            </IonList >
        </IonContent >
    )
}
