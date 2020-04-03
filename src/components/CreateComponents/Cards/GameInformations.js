import React, { useContext, useRef, useState } from "react";
import {
    IonInput,
    IonLabel,
    IonItem,
    IonRange,
    IonList,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonTextarea,
    IonBadge,
    IonButton,
    IonCheckbox,
} from "@ionic/react";
import { AppContext as CreateGameContext } from "../../../StateCreateGame";
export default function GameInformations() {
    const refInput = useRef();
    const { state, dispatch } = useContext(CreateGameContext);
    const [loadingImage, setLoadingImage] = useState(false);
    const [currentFile, setCurrentFile] = useState()

    const setTitle = title => {
        dispatch({
            type: "setTitle",
            title
        });
    };
    const setInOrder = inOrder => {
        dispatch({
            type: "setinOrder",
            inOrder: inOrder || false
        });
    };

    const setDescription = description => {
        dispatch({
            type: "setDescription",
            description: description || ""
        });
    };

    const setImage = image => {
        dispatch({
            type: "setImageUrl",
            image
        });
    };
    const setMaxPlayers = maxPlayers => {
        dispatch({
            type: "setMaxPlayers",
            maxPlayers: maxPlayers || 4
        });
    };
    const setPassword = password => {
        dispatch({
            type: "setPassword",
            password: password
        });
    }

    const onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            setLoadingImage(true)
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                setCurrentFile(URL.createObjectURL(event.target.files[0]));
                setImage(event.target.files[0]);

            } else {
                setLoadingImage(false)
                console.log('This file is not an image')
            }
        } else {
            setLoadingImage(false)
        }
    }


    return (
        <div className="stickyContainer">
            <IonCard>
                <IonCardContent>
                    <IonCardTitle>Game Informations</IonCardTitle>
                    <IonList >

                        <IonItem lines="full">
                            <IonLabel position="floating" style={{ fontSize: "24px" }}>Title*:</IonLabel>
                            <IonInput required
                                onIonChange={e => setTitle(e.target.value)}
                            ></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Team Size:</IonLabel>
                            <IonRange min={1} max={12} color="primary" snaps pin onIonChange={e => setMaxPlayers(e.target.value)} value={state.maxPlayers}>
                                <IonLabel slot="start">1</IonLabel>
                                <IonLabel slot="end">12</IonLabel>
                            </IonRange>
                            <IonBadge size="large">
                                {state.maxPlayers}
                            </IonBadge>
                        </IonItem>
                        <IonItem>
                            <IonLabel >Challenges in order:</IonLabel>
                            <IonCheckbox onIonChange={e => setInOrder(e.detail.checked)} slot="end" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Description:</IonLabel>
                            <IonTextarea onIonChange={e => setDescription(e.target.value)}>
                            </IonTextarea>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Password:</IonLabel>
                            <IonInput type="text" onIonChange={e => setPassword(e.target.value)}></IonInput>
                        </IonItem>
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
                        {currentFile && <img src={currentFile}></img>}
                    </IonList>
                </IonCardContent>
            </IonCard>
        </div >)
}
