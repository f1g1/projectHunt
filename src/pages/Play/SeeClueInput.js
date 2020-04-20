import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PlayService } from '../../services/PlayService';

function TextInput(props) {
    const [input, setinput] = useState()
    const handleSubmit = () => {
        if (input) {
            if (props.step.code.toString().toLowerCase() === input.toLowerCase()) {
                PlayService.submitAnswer(input, props.step, props.team).then(() => {
                    props.handleClose();
                }).catch((x) => console.log(x));
                props.handleSucces();
            }
            else {
                props.handleWrong();
            }
        }
    }
    return (
        <>
            <IonItem className="ion-margin-bottom">
                <IonLabel>Code:</IonLabel>
                <IonInput
                    value={input}
                    onIonChange={e => {
                        setinput(e.target.value)
                    }}
                    maxlength="12"
                ></IonInput>
            </IonItem>
            <IonButton className="ion-margin-top" expand="full" onClick={handleSubmit}>Submit</IonButton>
        </>)
}
function QrInput(props) {
    console.log("render qrinptu")
    const [input, setInput] = useState()
    const openScanner = async () => {


        BarcodeScanner.scan().then(barcodeData => {
            setInput(barcodeData.text);

        }).catch(err => {
            console.log("Qr scan failed");
        });
    };
    useEffect(() => {

        if (input) {
            if (props.step.code.toString() === input) {
                PlayService.submitAnswer(input, props.step, props.team).then(() => {
                    props.handleClose();
                }).catch((x) => console.log(x));
                props.handleSucces();
            }
            else {
                props.handleWrong();
            }

        }
    }, [input])


    return (
        <>
            {input}
            <IonButton size="largest" color="tertiary" expand="full" onClick={openScanner} style={{ minHieght: "50px" }}>Scan!</IonButton>
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
