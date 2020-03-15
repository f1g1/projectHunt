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

    console.log("RENDER TEAMS CONTAINER", props.teams)
    return (
        <Fragment>
            <h3>Teams</h3>
            <IonList>

                {props.teams.sort((a, b) => {
                    if (a.name < b.name) { return -1; }
                    if (a.name > b.name) { return 1; }
                    return 0;
                }).map((team, index) => {
                    return <Fragment key={team.name}>
                        <IonItem detail lines="none" color="tertiary" button onClick={() => props.showThisTeam(team.name)} key={team.name + index + "das"}>
                            <IonItem color="tertiary" lines="none">
                                <IonBadge color={team.players.length / props.max === 1 ? "danger" : "primary"} mode="ios">
                                    <h5>{team.players.length}/{props.max}</h5>
                                </IonBadge>

                            </IonItem>

                            <h1>
                                {team.name}
                            </h1>


                        </IonItem>
                        <IonItemDivider key={team.name + index} />
                    </Fragment>
                })
                }
                <IonItem>
                    <IonInput placeholder="TeamName" maxlength="20" minlength="3" type="text" value={newTeamName} onIonChange={(e) => setnewTeamName(e.detail.value)}></IonInput>
                    <IonButton onClick={addTeam} size="default">New team!</IonButton>

                </IonItem>

            </IonList >
        </Fragment>
    )
}
