import { IonButton, IonCheckbox, IonInput, IonItem, IonLabel } from '@ionic/react';
import React, { useState } from 'react';

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

function TextInput(props) {
    return (
        <IonItem>
            <IonLabel>Code:</IonLabel>
            <IonInput
                value={props.step.code || null}
                onIonChange={e => {
                    props.setStep({ ...props.step, code: e.target.value })
                }}
                maxlength="12"
            ></IonInput>
        </IonItem>
    )
}
function QrInput(props) {

    const [qr, setQr] = useState()
    const generateQR = (code) => {
        props.setStep({ ...props.step, code: code });
        MiscService.getQr(code).then(x => { setQr(x.url) })
    }
    return (
        <>
            <IonButton
                onClick={() => generateQR(makeid(6))}
            >
                Generate
            </IonButton>
            {qr && <img src={qr}></img>}
            <p>
                {qr && <a href={qr} download>Click to open on new page</a>}

            </p>
        </>
    )
}
function ImageInput(props) {
    return (
        <>
            <IonItem>
                <IonLabel>Needs Validation?</IonLabel>
                <IonCheckbox onIonChange={e => props.setStep({ ...props.step, needsValidation: e.detail.checked })} value={props.step.needsValidation} ></IonCheckbox>
            </IonItem>
        </>
    )
}




export default function ChallengeInput(props) {

    const hanleRender = () => {
        switch (props.step.answerType) {
            case 0:
                return (<TextInput {...props} />)
            case 1:
                return (<QrInput {...props} />)
            case 2:
                return (<ImageInput {...props} />)
            default:
                return (<TextInput {...props} />)

                break;
        }
    }
    return (hanleRender())
}
