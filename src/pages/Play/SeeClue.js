import React, { useEffect, useState } from 'react'
import { IonPage, IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonImg } from '@ionic/react'
import { PlayService } from '../../services/PlayService';

export default function SeeClue(props) {
    console.log(props.location.index)
    const [step, setStep] = useState()
    useEffect(() => {
        setStep(PlayService.getGame().steps[props.location.index])
    }, [])
    return (
        <IonPage>
            {step && <>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <img src={step.image} />
                    <IonTitle>
                        <h1>
                            {step.clue}
                        </h1>
                    </IonTitle>


                </IonContent>
            </>}
        </IonPage>
    )
}
