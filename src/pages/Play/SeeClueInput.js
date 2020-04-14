import { IonButton, IonInput, IonItem, IonItemDivider, IonLabel } from '@ionic/react'
import React, { useState } from 'react'

import MiscService from '../../services/MiscService'

function TextInput(props) {
    const [input, setinput] = useState()

    return (
        <>
            <IonItem>
                <IonLabel>Code:</IonLabel>
                <IonInput
                    value={input}
                    onIonChange={e => {
                        setinput(e.target.value)
                    }}
                    maxlength="12"
                ></IonInput>
            </IonItem>
            <IonItemDivider lines="none" />
            <IonButton expand="full">Submit</IonButton>
        </>)
}
function QrInput(props) {

    const [qr, setQr] = useState()
    const generateQR = (code) => {
        props.setStep({ ...props.step, code: code });
        MiscService.getQr(code).then(x => { setQr(x.url) })
    }
    return (
        <>
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
                <IonLabel>Needs </IonLabel>
            </IonItem>
        </>
    )
}



export default function SeeClueInput(props) {
    const hanleRender = () => {
        switch (props.answerType) {
            case 0:
                return (<TextInput {...props} />)
            case 1:
                return (<QrInput {...props} />)
            case 2:
                return (<ImageInput {...props} />)
            default:
                return (<TextInput {...props} />)
        }
    }
    return (hanleRender())
}
