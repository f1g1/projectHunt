import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';

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
    const refInput = useRef();
    const [loadingImage, setLoadingImage] = useState(false);
    const [image, setImage] = useState();
    const [imageFile, setImageFile] = useState();
    const onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            setLoadingImage(true)
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                setImage(URL.createObjectURL(event.target.files[0]));
                setImageFile(event.target.files[0]);

            } else {
                setLoadingImage(false)
                console.log('This file is not an image')
            }
        } else {
            setLoadingImage(false)
        }
    }
    const handleSend = () => {
        debugger;
        PlayService.submitAnswerImage(imageFile, props.step, props.team);
    }
    return (
        <>
            <IonButton
                onClick={() => refInput.current.click()}
            >Add Photo</IonButton>
            <input
                ref={refInput}
                accept="image/*"
                className="viewInputGallery"
                type="file"
                onChange={onChoosePhoto}
            />
            {image &&
                <><img src={image} style={{ maxHeight: "350px" }} />
                    <IonButton onClick={handleSend}>Save</IonButton> </>}
            <div style={{ position: "absolute", bottom: "0px" }} className="ion-padding ion-text-center">
                {props.step.needsValidation && <IonLabel><p>Note: Because this photo proof will still be credited at the time of submission not approval</p></IonLabel>}
            </div>

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
