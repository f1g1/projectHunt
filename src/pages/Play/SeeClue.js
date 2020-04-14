import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { PhotoViewer } from '@ionic-native/photo-viewer';
import { PlayService } from '../../services/PlayService';
import SeeClueInput from './SeeClueInput';
import { close } from "ionicons/icons";

export default function SeeClue(props) {

    const [code, setCode] = useState()
    const [step, setStep] = useState()

    useEffect(() => {
        setStep(props.step)
    }, [])

    const handleSubmit = () => {
        if (code && step.code.toString().toLowerCase() === code.toLowerCase()) {
            PlayService.submitAnswer(code, step, props.team).then(() => {
                props.handleClose();
            }).catch((x) => console.log(x));
        }
    }
    return (
        <>
            &nbsp;
            {step && <>
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonButtons>
                            <IonButton onclick={props.handleClose}>
                                <IonIcon icon={close} ></IonIcon>
                            </IonButton>
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
                    <SeeClueInput answerType={props.answerType} step={step} />
                </IonContent>
            </>}
        </>
    )
}
