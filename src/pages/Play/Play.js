import React, { useState, useEffect } from 'react'
import { IonHeader, IonPage, IonToolbar, IonLabel, IonContent, IonList, IonItem, IonThumbnail, IonImg, IonCard, IonCardContent, IonCol, IonRow, IonGrid, IonCardSubtitle, IonTitle } from '@ionic/react'
import { PlayService } from '../../services/PlayService'

export default function Play(props) {
    const [game, setGame] = useState()
    useEffect(() => {
        if (props.location.lobby)
            PlayService.setGame(props.location.lobby);
        setGame(PlayService.getGame());
    }, [])

    const hanldeStepClick = (index) => {
        props.history.push({ pathname: "/seeClue", index });
    }
    return (
        <IonPage>
            {game && <>
                <IonHeader>
                    <IonToolbar color="primary">
                        <h1>
                            {game.title}
                        </h1>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonTitle>
                        Challenges
                    </IonTitle>
                    <IonList>
                        {game.steps.map((x, index) => (
                            <IonItem button onClick={() => hanldeStepClick(index)}>
                                <IonThumbnail slot="start">
                                    <img src={x.image} />
                                </IonThumbnail>
                                <IonLabel>
                                    <h2>#{index + 1}</h2>
                                    <h3>{x.clue}</h3>
                                    <p style={{ float: "right" }}>Requieres photo proof!</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>


                </IonContent>
            </>
            }

        </IonPage >

    )
}
