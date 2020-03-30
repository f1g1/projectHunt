import React, { useState, useEffect, useContext } from 'react'
import { IonHeader, IonPage, IonToolbar, IonLabel, IonContent, IonList, IonItem, IonThumbnail, IonImg, IonCard, IonCardContent, IonCol, IonRow, IonGrid, IonCardSubtitle, IonTitle, IonChip, IonToast, IonModal } from '@ionic/react'
import { PlayService } from '../../services/PlayService'
import useTeamChanges from '../../services/useTeamChanges'
import { UserService } from '../../services/UserSerivce'
import { LobbyService } from '../../services/LobbyService'
import SeeClue from './SeeClue'

const showStatus = {
    ACTIVE: 0,
    COMPLETED: 1
}

export default function Play(props) {

    const [showSteps, setShowSteps] = useState(0)
    const [game, setGame] = useState()
    const [showToast1, setShowToast1] = useState()
    const teams = useTeamChanges()
    const [showClueModal, setShowClueModal] = useState(false)
    const [clueInfo, setClueInfo] = useState()
    const [filtered, setFiltered] = useState()
    useEffect(() => {
        if (props.location.lobby)
            PlayService.setGame(props.location.lobby);
        let game = PlayService.getGame();
        setGame(game);
    }, [])
    useEffect(() => {
        if (!LobbyService.getCurrentTeam() && teams) {
            let myTeam = teams.filter(x => x.players.includes(UserService.getCurrentPlayer().name));
            if (myTeam.length > 0) {
                debugger;
                LobbyService.setCurrentTeam(myTeam[0].name)
            }
        }
        game && teams && LobbyService.getCurrentTeam() && setFiltered(showSteps === showStatus.ACTIVE ? PlayService.getActiveSteps(game, LobbyService.getCurrentTeam(), teams) : PlayService.getCompletedSteps(game, LobbyService.getCurrentTeam(), teams))
    }, [teams])
    useEffect(() => {
        game && teams && LobbyService.getCurrentTeam() && setFiltered(showSteps === showStatus.ACTIVE ? PlayService.getActiveSteps(game, LobbyService.getCurrentTeam(), teams) : PlayService.getCompletedSteps(game, LobbyService.getCurrentTeam(), teams))

    }, [showSteps])
    const hanldeStepClick = (id) => {
        setShowClueModal(true);
        setClueInfo({ step: game.steps.find(x => x.id === id), team: LobbyService.getCurrentTeam() });
    }
    const setShowStepsCompleted = () => {
        setShowSteps(showStatus.COMPLETED);
    }

    const setShowStepsActive = () => {
        setShowSteps(showStatus.ACTIVE);
    }
    return (
        <IonPage>
            {LobbyService.getCurrentTeam()}
            <p className="ion-text-center">
                <IonChip outline={showSteps === showStatus.ACTIVE} onClick={setShowStepsActive} mode="ios" color={showSteps !== showStatus.ACTIVE && "light"}>
                    <IonLabel>Active!</IonLabel>
                </IonChip>
                <IonChip outline={showSteps === showStatus.COMPLETED} onClick={setShowStepsCompleted} mode="ios" color={showSteps !== showStatus.COMPLETED && "light"} >
                    <IonLabel>Completed!</IonLabel>
                </IonChip>
            </p>
            {
                game && <>
                    <IonHeader>
                        <IonToolbar color="primary">
                            <h1>
                                {game.title}
                            </h1>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonTitle>
                            Challenges
                    </IonTitle>
                        <IonList>
                            {filtered && filtered.map((x, index) => (
                                <IonItem button onClick={() => hanldeStepClick(x.id)}>
                                    <IonThumbnail slot="start">
                                        <img src={x.image} />
                                    </IonThumbnail>
                                    <IonLabel>
                                        <h2>#{index + 1}</h2>
                                        <h3>{x.clue}</h3>
                                        <p style={{ float: "right" }}>Requieres photo proof!</p>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                </>
            }
            <IonModal
                isOpen={showClueModal}
                onDidDismiss={() => setShowClueModal(false)}
            >
                <SeeClue
                    handleClose={() => setShowClueModal(false)}
                    game
                    {...clueInfo}
                ></SeeClue>
            </IonModal>
        </IonPage >

    )
}
