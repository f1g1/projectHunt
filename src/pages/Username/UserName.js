import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonPage, IonRow, IonToast } from '@ionic/react'
import React, { useState } from 'react'

import { UserService } from '../../services/UserSerivce'

export default function UserName(props) {
    const [name, setName] = useState()
    const [showToast, setShowToast] = useState(false)
    let handleSubmit = () => {
        let userName = name.trim()
        if (!userName || userName.length < 3 || userName.includes(" "))
            setShowToast(true)
        UserService.SaveNewUser({ ...props.location.user, userName }).then(props.history.push({
            pathname: "/home",
            state: {
                name: props.location.username || props.location.userdisplayName,
                image: props.location.userimageUrl,
                email: props.location.useremail
            }
        }));
    }
    return (
        <IonPage >

            <IonContent color="primary">
                <IonGrid style={{ marginTop: "200px" }}>
                    <IonRow>
                        <IonCol size="5" offset="3">

                            <h1>Choose your adventurer name:</h1>
                            <IonItem>
                                <IonInput onIonChange={e => setName(e.target.value)} type="text" maxlength="25" minlength="3" />
                                <IonButton onClick={handleSubmit} size="large">
                                    Save!
                                </IonButton>

                            </IonItem>

                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
            <IonToast
                color="danger"
                position="top"
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message="Name must be at least 3 character long and shouldn't contain ' '."
                duration={2000}
            />
        </IonPage >

    )
}
