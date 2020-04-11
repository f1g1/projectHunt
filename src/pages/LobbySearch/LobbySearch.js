import "./LobbySearch.scss";

import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonThumbnail } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { LobbyService } from '../../services/LobbyService';
import { UserService } from '../../services/UserSerivce';
import moment from 'moment';

export default function LobbySearch(props) {
    const [lobbies, setlobbies] = useState([])
    useEffect(() => {
        LobbyService.getLobbies().then(x => { console.log(x); setlobbies(x); })

    }, [])
    const joinLobby = (lobbyId) => {
        LobbyService.setLobby(UserService.getCurrentPlayer(), lobbyId)
        props.history.push({ pathname: "/lobby", lobbyId });

    }
    return (
        <IonPage>
            <IonContent>
                <IonRow>
                    <IonCol sizeXl="4" sizeSm="12" offsetXl="4">
                        {/*-- Default List Header --*/}

                        <IonListHeader>
                            <h2>Choose a Lobby for a game
                            </h2>
                        </IonListHeader>
                        <IonList>

                            {lobbies && lobbies.map(x => (
                                <IonCard>
                                    <IonCardHeader color="primary   ">
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
                                                        <IonButton size="default" onClick={() => joinLobby(x.lobbyId)}>Join Lobby!</IonButton>
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>


                                        </IonGrid>


                                        <IonItem lines="none">

                                            <IonLabel>
                                                {moment(x.lobbyCreatedDate).diff(moment(Date.now()).seconds)}
                                                {/* <p> Created {moment.duration(moment(Date.now()).diff(moment(x.lobbyCreatedDate)))} minutes ago </p> */}
                                            </IonLabel>
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
