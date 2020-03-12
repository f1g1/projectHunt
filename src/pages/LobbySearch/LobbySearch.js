import React, { useState, useEffect } from 'react'
import { IonButton, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonCol, IonItemGroup } from '@ionic/react';
import { LobbyService } from '../../services/LobbyService';
import { UserService } from '../../services/UserSerivce';


export default function LobbySearch(props) {
    const [lobbies, setlobbies] = useState([])
    useEffect(() => {
        LobbyService.getLobbies().then(x => { console.log(x); setlobbies(x); })

    }, [])
    const joinLobby = (lobbyId) => {
        // LobbyService.joinLobby(UserService.getCurrentPlayer(), lobbyId)
        // .then(x => {
        props.history.push({ pathname: "/lobby", lobbyId });

        // })

    }
    return (
        <IonPage>
            <IonContent>
                <IonRow>
                    <IonCol sizeXl="4" sizeSm="12">
                        {/*-- Default List Header --*/}
                        <IonListHeader>
                            <h2>Choose a Lobby for a game
                            </h2>
                        </IonListHeader>
                        {lobbies.map(x => (
                            <IonItem key={x.lobbyId}>
                                <IonLabel>{x.title}</IonLabel>
                                <IonButton size="default" onClick={() => joinLobby(x.lobbyId)}>Join Lobby!</IonButton>
                            </IonItem>

                        ))}



                    </IonCol>
                </IonRow>

            </IonContent>
        </IonPage>
    )
}
