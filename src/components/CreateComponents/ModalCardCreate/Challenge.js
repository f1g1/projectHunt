import React, { useRef, useState, useEffect } from 'react'
import {
    IonList,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonSelect,
    IonSelectOption,
} from "@ionic/react";
import ChallengeInput from './ChallengeInput';

export default function Challenge(props) {
    const [loadingImage, setLoadingImage] = useState(false);
    const refInput = useRef();
    const onChoosePhoto = event => {
        debugger;
        if (event.target.files && event.target.files[0]) {
            setLoadingImage(true)
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                props.setStep({ ...props.step, imageUrl: URL.createObjectURL(event.target.files[0]), currentFile: event.target.files[0] });
            } else {
                setLoadingImage(false)
                console.log('This file is not an image')
            }
        } else {
            setLoadingImage(false)
        }
    }
    return (
        <IonList >
            {props.step.currentFile && <>
                <img className="ion-justify-content-center ion-align-self-center" src={props.step.imageUrl} />

            </>}
            <IonButton
                onClick={() => refInput.current.click()}
            >Add Photo</IonButton>
            <input
                ref={refInput}
                accept="image/*"
                className="viewInputGallery"
                type="file"
                onChange={onChoosePhoto}
            />  <IonItem>
                <IonLabel position="stacked">Clue</IonLabel>
                <IonTextarea
                    value={props.step.clue}
                    onIonChange={e => props.setStep({ ...props.step, clue: e.target.value })}
                    maxlength="500"
                ></IonTextarea>
            </IonItem>
            <IonItem>
                <IonLabel>Answer Type:</IonLabel>
                <IonSelect interface="popover" onIonChange={e => props.setStep({ ...props.step, answerType: e.target.value })} value={props.step.answerType} placeholder="Choose answer type">
                    <IonSelectOption value={0}>Text</IonSelectOption>
                    <IonSelectOption value={1}>QR</IonSelectOption>
                    <IonSelectOption value={2}>Photo</IonSelectOption>
                </IonSelect>
            </IonItem>
            <ChallengeInput {...props} />
        </IonList>
    )
}
