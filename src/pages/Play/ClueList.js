import { IonChip, IonCol, IonImg, IonItem, IonLabel, IonList, IonModal, IonRow, IonThumbnail, IonTitle } from '@ionic/react'
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
        let status
        if (showStatus.COMPLETED == showSteps)
            status = 1;
        setClueInfo({ step: props.game.steps.find(x => x.id === id), team: LobbyService.getCurrentTeam(), status: status });

    }

    useEffect(() => {
        console.log(props.teams, "TEAMSS")
        props.teams.length > 0 && console.log(props.teams.find(y => y.name === LobbyService.getCurrentTeam())[1586791937998], 'hsadf')
    })
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
        props.game && props.teams.length > 0 && LobbyService.getCurrentTeam() && setFiltered(showSteps === showStatus.ACTIVE ? PlayService.getActiveSteps(props.game, LobbyService.getCurrentTeam(), props.teams)
            : PlayService.getCompletedSteps(props.game, LobbyService.getCurrentTeam(), props.teams))
    }, [props.teams])
    useEffect(() => {
        props.game && props.teams.length > 0 && LobbyService.getCurrentTeam() && setFiltered(showSteps === showStatus.ACTIVE ? PlayService.getActiveSteps(props.game, LobbyService.getCurrentTeam(), props.teams)
            : PlayService.getCompletedSteps(props.game, LobbyService.getCurrentTeam(), props.teams))
    }, [showSteps])

    return (
        <>
            <IonRow>
                <IonCol sizeLg={6} offsetLg={3}>

                    <p className="ion-text-center">
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
                            <IonItem button onClick={() => hanldeStepClick(x.id)} style={showSteps === showStatus.COMPLETED ? { opacity: 0.6 } : {}} key={x.id}>
                                <IonThumbnail slot="start">
                                    <img src={x.image} />
                                </IonThumbnail>
                                <IonLabel>
                                    {props.teams.find(y => y.name === LobbyService.getCurrentTeam()).toBeValidated.find(z => z === x.id) &&
                                        <p style={{ float: "right" }}>
                                            Pending validation
                                   </p>}
                                    <h2>#{index + 1}</h2>
                                    <h3>{x.clue}</h3>
                                        &nbsp;
                                        <h2 color="danger">Answer:</h2>
                                    {showSteps === showStatus.COMPLETED &&
                                        (

                                            //for text/qr we show the answer as label
                                            props.teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id] && (x.answerType < 2 ?
                                                <IonLabel color="danger">
                                                    {console.log(filtered, x.id, "fff")}
                                                    {props.teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id].answer}
                                                </IonLabel>

                                                : <IonThumbnail slot="end" className="ion-float-right">
                                                    <IonImg src={props.teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id].image}></IonImg></IonThumbnail>)


                                        )}
                                    {/* <p> Submitted by: {props.teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id].submitedBy}  at {(moment(teams.find(y => y.name === LobbyService.getCurrentTeam())[x.id].time.date).format("hh:mm"))} </p> */}

                                    {/* <p>
                                        <br></br>
                                        {x.answerType == 2 && "Requieres photo proof!"}</p> */}
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonCol>

            </IonRow>
            <IonModal
                isOpen={showClueModal}
                onDidDismiss={() => setShowClueModal(false)}>
                <SeeClue
                    handleClose={() => setShowClueModal(false)}
                    game
                    {...clueInfo} />
            </IonModal>
        </>
    )
}
