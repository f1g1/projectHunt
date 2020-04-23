import { IonTitle } from '@ionic/react';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import React from 'react';
import SeeClueInput from './SeeClueInput';

export default function SeeClueChallenge(props) {
    console.log(props.step)
    return (
        <>
            &nbsp;
            {props.step && <>
                <img src={props.step.image} style={{ maxHeight: "400px" }} onClick={() => PhotoViewer.show(props.step.image)} />
                <IonTitle>
                    <h1>
                        {props.step.clue}
                    </h1>
                </IonTitle>
                <div>
                    <SeeClueInput answerType={props.step.answerType} {...props} />

                </div>

            </>}
        </>
    )
}
