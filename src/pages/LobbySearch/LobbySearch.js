import "./LobbySearch.scss";

import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonThumbnail } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { LobbyService } from '../../services/LobbyService';
import { UserService } from '../../services/UserSerivce';
import moment from 'moment';

export default function LobbySearch(props) {
    const [lobbies, setlobbies] = useState([])
    const [date, setdate] = useState()
    useEffect(() => {
        LobbyService.getLobbies().then(x => { console.log(x); setlobbies(x); })
        setdate(new Date());
    }, [])
    const joinLobby = (lobby) => {

        LobbyService.setLobby(UserService.getCurrentPlayer(), lobby.lobbyId)
        // if (!lobby.startTime)
        props.history.push({ pathname: "/lobby", lobbyId: lobby.lobbyId });
        // else {

        // }

    }
    return (
        <IonPage>
            <IonContent>
                <IonRow>
                    <IonCol sizeXl="5" sizeSm="12" offsetXl="3.5">
                        <IonListHeader>
                            <h2>Choose a Lobby for a game
                            </h2>
                        </IonListHeader>
                        <IonList>
                            {lobbies && lobbies.map(x => (
                                <IonCard key={x.owner + x.lobbyCreatedDate}>
                                    <IonCardHeader color="primary">
                                        <IonCardTitle>
                                            {x.title} </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol sizeXl="4">
                                                    <IonThumbnail className="bigThumbnail">
                                                        <img src={x.image}></img>
                                                    </IonThumbnail>
                                                </IonCol>
                                                <IonCol>
                                                    <IonItem>
                                                        <IonButton size="default" onClick={() => joinLobby(x)}>Join Lobby!</IonButton>
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                        <IonItem lines="none">
                                            {x.lobbyCreatedDate &&
                                                <p>
                                                    Created {(moment(date).diff(moment(x.lobbyCreatedDate), "minutes"))} minutes ago
                                                </p>
                                            }
                                            <IonLabel slot="end">
                                                <p>
                                                    by    {x.owner}
                                                </p>
                                            </IonLabel>
                                        </IonItem>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                        </IonList>
                    </IonCol>
                </IonRow>

            </IonContent>
        </IonPage>
    )
}
