import { IonButton, IonButtons, IonCol, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import CloseIcon from '@material-ui/icons/Close'
import PlayerTag from './PlayerTag'

export default function LobbyPlayers(props) {
    const [searchString, setSearchString] = useState()
    const [filtered, setfiltered] = useState(props.game.players)

    useEffect(() => {
        debugger;
        if (searchString)
            setfiltered(props.game.players.filter(x => x.toLowerCase().includes(searchString.toLowerCase())))
    }, [searchString])
    return (
        <div>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons style={{ display: "inline-block" }}>
                        <IonButton onclick={props.handleClose}>
                            <CloseIcon />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="ion-no-padding"
                        style={{
                            display: "inline-block",
                            position: "absolute",
                            bottom: "15px"
                        }} >All Players</IonTitle>

                </IonToolbar>
            </IonHeader>
            <IonRow>
                <IonCol offsetXl="3" sizeXl="6">
                    <IonItem className="ion-margin  ">
                        <IonLabel>Search:</IonLabel>
                        <IonInput
                            value={searchString}
                            onIonChange={e => setSearchString(e.target.value)}
                            placeholder="Type player name here"
                        />


                    </IonItem>
                </IonCol>
            </IonRow>

            <IonList>
                <IonListHeader>Players:</IonListHeader>
                {filtered.map(x =>
                    <PlayerTag player={x} game={props.game} key={x + "p"} />)}
            </IonList>
        </div>
    )
}
