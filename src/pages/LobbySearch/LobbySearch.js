import React, { useState, useEffect } from 'react'
import { IonButton, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonCol, IonItemGroup, IonAvatar, IonCard, IonThumbnail, IonCardContent, IonGrid, IonCardTitle, IonCardHeader } from '@ionic/react';
import { LobbyService } from '../../services/LobbyService';
import { UserService } from '../../services/UserSerivce';
import "./LobbySearch.scss"

export default function LobbySearch(props) {
    const [lobbies, setlobbies] = useState([])
    useEffect(() => {
        LobbyService.getLobbies().then(x => { console.log(x); setlobbies(x); })

    }, [])
    const joinLobby = (lobbyId) => {
        LobbyService.joinLobby(UserService.getCurrentPlayer(), lobbyId)
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

                            {lobbies.map(x => (
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
                                                <p> Created 5 minutes ago </p>
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
