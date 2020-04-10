import React, { useRef, useState } from 'react'
import { IonButton, IonRow, IonCol, IonInput, IonLabel, IonItem, IonTextarea, IonCardContent, IonCardTitle, IonCard } from '@ionic/react'

export default function Response(props) {
    const refSuccesInput = useRef();
    const refWrongInput = useRef();
    const [loadingImage, setLoadingImage] = useState(false);


    const onChooseSuccesPhoto = (event, succes) => {
        debugger;
        if (event.target.files && event.target.files[0]) {
            setLoadingImage(true)
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                if (succes)
                    props.setStep({ ...props.step, succesResponseImage: URL.createObjectURL(event.target.files[0]), succesResponseCurrentFile: event.target.files[0] });
                else
                    props.setStep({ ...props.step, wrongResponseImage: URL.createObjectURL(event.target.files[0]), wrongResponseCurrentFile: event.target.files[0] });
            } else {
                setLoadingImage(false)
                console.log('This file is not an image')
            }
        } else {
            setLoadingImage(false)
        }
    }
    return (
        <>
            <IonRow>
                <IonCol>

                    <IonCard>
                        <IonCardContent color="primary">
                            <IonCardTitle>Correct Answer:</IonCardTitle>
                            {props.step.succesResponseImage &&
                                <img className="ion-justify-content-center ion-align-self-center" src={props.step.succesResponseImage} />}
                            <IonButton
                                full
                                onClick={() => refSuccesInput.current.click()}
                            >Add Photo</IonButton>
                            <input
                                ref={refSuccesInput}
                                accept="image/*"
                                className="viewInputGallery"
                                type="file"
                                onChange={e => onChooseSuccesPhoto(e, true)}
                            />
                            <IonItem>

                                <IonLabel position="floating" >Title:</IonLabel>
                                <IonInput
                                    onIonChange={e => {
                                        props.setStep({ ...props.step, succesResponseTitle: e.target.value })
                                    }}
                                    maxlength="50"
                                ></IonInput>
                            </IonItem>
                            <IonItem>

                                <IonLabel position="floating" >Info:</IonLabel>
                                <IonTextarea
                                    onIonChange={e => {
                                        props.setStep({ ...props.step, succesResponseAdditionalInfo: e.target.value })
                                    }}
                                    maxlength="500"
                                ></IonTextarea>
                            </IonItem>
                        </IonCardContent>

                    </IonCard>
                    <IonCard color="danger">
                        <IonCardContent >
                            <IonCardTitle>Wrong Answer:</IonCardTitle>
                            {props.step.wrongResponseImage &&
                                <img className="ion-justify-content-center ion-align-self-center" src={props.step.wrongResponseImage} />}
                            <IonButton
                                color="light"
                                full
                                onClick={() => refWrongInput.current.click()}
                            >Add Photo</IonButton>
                            <input
                                ref={refWrongInput}
                                accept="image/*"
                                className="viewInputGallery"
                                type="file"
                                onChange={e => onChooseSuccesPhoto(e, false)}
                            />
                            <IonItem color="danger">
                                <IonLabel position="floating" >Title:</IonLabel>
                                <IonInput
                                    onIonChange={e => {
                                        props.setStep({ ...props.step, wrongResponseTitle: e.target.value })
                                    }}
                                    maxlength="50"
                                ></IonInput>
                            </IonItem>
                            <IonItem color="danger" >

                                <IonLabel position="floating" >Info:</IonLabel>
                                <IonTextarea
                                    onIonChange={e => {
                                        props.setStep({ ...props.step, wrongResponseAdditionalInfo: e.target.value })
                                    }}
                                    maxlength="500"
                                ></IonTextarea>
                            </IonItem>

                        </IonCardContent>

                    </IonCard>
                </IonCol>
            </IonRow>

        </>
    )
}
