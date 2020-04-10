import { IonChip, IonItem, IonLabel, IonList, IonModal, IonThumbnail, IonTitle } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import { LobbyService } from '../../services/LobbyService'
import { PlayService } from '../../services/PlayService'
import SeeClue from './SeeClue'
import { UserService } from '../../services/UserSerivce'

const showStatus = {
    ACTIVE: 0,
    COMPLETED: 1
}
export default function ClueList(props) {
    const [filtered, setFiltered] = useState([])
    const [showClueModal, setShowClueModal] = useState(false)
    const [clueInfo, setClueInfo] = useState()
    const [showSteps, setShowSteps] = useState(0)
    const hanldeStepClick = (id) => {
        setShowClueModal(true);
        setClueInfo({ step: props.game.steps.find(x => x.id === id), team: LobbyService.getCurrentTeam() });
    }
    const setShowStepsCompleted = () => {
        setShowSteps(showStatus.COMPLETED);
    }
    const setShowStepsActive = () => {
        setShowSteps(showStatus.ACTIVE);
    }
    useEffect(() => {
        if (!LobbyService.getCurrentTeam() && props.teams) {
            let myTeam = props.teams.filter(x => x.players.includes(UserService.getCurrentPlayer().name));
            if (myTeam.length > 0) {
                LobbyService.setCurrentTeam(myTeam[0].name)
            }
        }
        console.log(props.teams)
        props.game && props.teams && LobbyService.getCurrentTeam() && setFiltered(showSteps === showStatus.ACTIVE ? PlayService.getActiveSteps(props.game, LobbyService.getCurrentTeam(), props.teams) : PlayService.getCompletedSteps(props.game, LobbyService.getCurrentTeam(), props.teams))
    }, [props.teams])
    useEffect(() => {
        props.game && props.teams && LobbyService.getCurrentTeam() && setFiltered(showSteps === showStatus.ACTIVE ? PlayService.getActiveSteps(props.game, LobbyService.getCurrentTeam(), props.teams) : PlayService.getCompletedSteps(props.game, LobbyService.getCurrentTeam(), props.teams))

    }, [showSteps])

    return (
        <><p className="ion-text-center">
            <IonChip outline={showSteps === showStatus.ACTIVE} onClick={setShowStepsActive} mode="ios" color={showSteps !== showStatus.ACTIVE && "light"}>
                <IonLabel>Active!</IonLabel>
            </IonChip>
            <IonChip outline={showSteps === showStatus.COMPLETED} onClick={setShowStepsCompleted} mode="ios" color={showSteps !== showStatus.COMPLETED && "light"} >
                <IonLabel>Completed!</IonLabel>
            </IonChip>
        </p>
            <IonTitle>
                {!showSteps ? `Active Challenges ${props.teams.length > 0 ? filtered.length : ""}` : `Completed Challenges ${filtered.length}`}
            </IonTitle>
            <IonList>
                {filtered && props.teams.length != 0 && filtered.length > 0 && filtered.map((x, index) => (
                    <IonItem button onClick={() => showSteps !== showStatus.COMPLETED && hanldeStepClick(x.id)} style={showSteps === showStatus.COMPLETED ? { opacity: 0.6 } : {}} key={x.id}>
                        <IonThumbnail slot="start">
                            <img src={x.image} />
                        </IonThumbnail>
                        <IonLabel>
                            <h2>#{index + 1}</h2>
                            <h3>{x.clue}</h3>
                                        &nbsp;
                                        <h2 color="danger">Answer:</h2>
                            {showSteps === showStatus.COMPLETED &&
                                (
                                    x.answerType < 3 ? <IonLabel color="danger">
                                        {props.teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id].answer}
                                    </IonLabel> :
                                        <IonThumbnail slot="start">
                                            <img src={props.teams[LobbyService.getCurrentTeam()][x.id].answer}></img>
                                        </IonThumbnail>
                                )}
                            < br ></br>
                            {/* <p> Submitted by: {props.teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id].submitedBy}  at {(moment(teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id].time.date).format("hh:mm"))} </p> */}
                            < p style={{ float: "right" }}>Requieres photo proof!</p>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>
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
        </>
    )
}
