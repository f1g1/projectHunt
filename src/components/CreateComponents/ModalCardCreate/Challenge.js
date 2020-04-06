import React, { useRef, useState, useEffect } from 'react'
import {
    IonList,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonContent,
    IonItemDivider,
} from "@ionic/react";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import MiscService from '../../../services/MiscService';


const makeid = length => {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
export default function Challenge(props) {
    const [code, setCode] = useState()
    const [qr, setQr] = useState()
    const [loadingImage, setLoadingImage] = useState(false);
    const refInput = useRef();
    useEffect(() => {
    })


    const generateQR = (code) => {
        setCode(code);
        MiscService.getQr(code).then(x => { debugger; setQr(x.url) })
    }


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
            <IonItem>
                <IonLabel>Code:</IonLabel>
                <IonInput
                    value={props.step.code}
                    onIonChange={e => {
                        props.setStep({ ...props.step, code: e.target.value })
                        console.log(e.target.value);
                    }}
                    maxlength="12"
                ></IonInput>

                {qr && <img src={qr}></img>}
                <p>
                    {qr && <a href={qr} download>Click to download</a>}

                </p>
                <IonButton
                    onClick={() => generateQR(makeid(6))}
                >
                    Generate
            </IonButton>
            </IonItem>
            <IonItem>
                <IonLabel>Needs Validation?</IonLabel>
                <IonCheckbox onIonChange={e => props.setStep({ ...props.step, needsValidation: e.detail.checked })} value={props.step.needsValidation} ></IonCheckbox>
            </IonItem>
        </IonList>
    )
}
