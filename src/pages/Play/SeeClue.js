import React, { useEffect, useState, useContext } from 'react'
import { IonPage, IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonImg, IonInput, IonItem, IonButton, } from '@ionic/react'
import { PlayService } from '../../services/PlayService';
import { PhotoViewer } from '@ionic-native/photo-viewer';

export default function SeeClue(props) {

    const [code, setCode] = useState()
    const [step, setStep] = useState()

    useEffect(() => {
        setStep(props.step)
    }, [])

    const handleSubmit = () => {
        if (code && step.answer.toString().toLowerCase() === code.toLowerCase()) {
            PlayService.submitAnswer(code, step, props.team).then(() => {
                props.history.goBack();
            }).catch((x) => console.log(x));
        }
    }
    return (
        <>

            &nbsp;
            {step && <>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <img src={step.image} style={{ maxHeight: "400px" }} onClick={() => PhotoViewer.show(step.image)} />
                    <IonTitle>
                        <h1>
                            {step.clue}
                        </h1>
                    </IonTitle>

                    {step.answerType == 0 &&
                        <IonItem>
                            <IonInput placeholder="Code"
                                onIonChange={e => {
                                    setCode(e.target.value);
                                }}>
                            </IonInput>
                            <IonButton size="default" onClick={handleSubmit}>Submit</IonButton>
                        </IonItem>}

                </IonContent>
            </>}
        </>
    )
}
