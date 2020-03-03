import React from 'react'
import { IonCardTitle, IonCardContent, IonCard, IonButton, IonLabel, IonList, IonItem } from '@ionic/react'

export default function TeamPanel(props) {
    return (
        <>
            <h3>&nbsp;</h3>
            <IonCard color="tertiary">
                <IonCardTitle >
                    <IonLabel>
                        {props.team.name}
                    </IonLabel>
                </IonCardTitle>

                <IonCardContent color="tertiary">
                    <IonList color="tertiary" className="ion-no-padding">
                        {props.team.members.map(x => <IonItem color="tertiary">
                            {x}
                        </IonItem>)}
                    </IonList>
                    <IonButton expand="full">
                        Join!
                    </IonButton>
                </IonCardContent>
            </IonCard>
        </>)
}
