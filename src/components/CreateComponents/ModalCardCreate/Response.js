import React, { useRef, useState } from 'react'
import { IonButton, IonRow, IonCol, IonInput, IonLabel, IonItem, IonTextarea } from '@ionic/react'

export default function Response(props) {
    const refInput = useRef();
    const [loadingImage, setLoadingImage] = useState(false);


    const onChoosePhoto = event => {
        debugger;
        if (event.target.files && event.target.files[0]) {
            setLoadingImage(true)
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                props.setStep({ ...props.step, responseImageUrl: URL.createObjectURL(event.target.files[0]), responseCurrentFile: event.target.files[0] });
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
                    {props.step.responseImageUrl &&
                        <img className="ion-justify-content-center ion-align-self-center" src={props.step.responseImageUrl} />}
                    <IonButton
                        full
                        onClick={() => refInput.current.click()}
                    >Add Photo</IonButton>
                    <input
                        ref={refInput}
                        accept="image/*"
                        className="viewInputGallery"
                        type="file"
                        onChange={onChoosePhoto}
                    />
                </IonCol>
            </IonRow>

            <IonRow>
                <IonCol>

                    <IonItem>

                        <IonLabel position="floating" >Response Title:</IonLabel>
                        <IonInput
                            value={props.step.responseTitle}
                            onIonChange={e => {
                                props.setStep({ ...props.step, responseTitle: e.target.value })
                            }}
                            maxlength="50"
                        ></IonInput>
                    </IonItem>
                    <IonItem>

                        <IonLabel position="floating" >Additional Info:</IonLabel>
                        <IonTextarea
                            value={props.step.responseAdditionalInfo}
                            onIonChange={e => {
                                props.setStep({ ...props.step, responseAdditionalInfo: e.target.value })
                            }}
                            maxlength="500"
                        ></IonTextarea>
                    </IonItem>
                </IonCol>
            </IonRow>

        </>
    )
}
