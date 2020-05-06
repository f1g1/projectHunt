import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonModal, IonPage, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import ChatBoard from '../../components/Chat/ChatBoard/ChatBoard'
import ClueList from './ClueList'
import Dashboard from '../GameDashobard/Dashboard'
import GameMap from './GameMap/GameMap'
import LeaderBoard from './LeaderBoard'
import { LobbyService } from '../../services/LobbyService'
import MiscService from '../../services/MiscService'
import { PlayService } from '../../services/PlayService'
import useGameChanges from '../../services/CustomHooks/useGameChanges'
import useTeamChanges from '../../services/CustomHooks/useTeamChanges'

export default function Play(props) {
    const [showChatModal, setShowChatModal] = useState(false)
    const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [geolocation, setGeolocation] = useState({ latitude: 0, longitude: 0 })
    const [game, setGame] = useState()

    const teams = useTeamChanges()
    const gameChanging = useGameChanges()

    useEffect(() => {
        MiscService.getCachedGeolocation().then(x => setGeolocation(x));

    }, [])

    useEffect(() => {
        PlayService.setGame(gameChanging || {});
        setGame(gameChanging);
    }, [gameChanging])


    return (
        <IonPage>
            {game && <>
                <IonHeader>

                    <IonToolbar color={LobbyService.ImAdmin(game) ? "tertiary" : "primary"}  >
                        <IonButtons style={{ display: "inline-block" }}>
                            <IonBackButton defaultHref='/home'></IonBackButton>
                        </IonButtons>
                        <h1 style={{ display: "inline-block" }}>
                            {game.title}
                        </h1>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {teams.length > 0 && game !== {} && (!LobbyService.ImAdmin(game) ? <ClueList game={game} teams={teams} /> :
                        <Dashboard />)}
                </IonContent>
                <IonFooter>
                    <IonToolbar>
                        <IonButtons>
                            <IonButton onClick={() => setShowChatModal(true)}>
                                Chat
                            </IonButton>
                            <IonButton onClick={() => setShowLeaderBoardModal(true)}>
                                LeaderBoard
                            </IonButton>
                            <IonButton onClick={() => setShowMap(true)}>
                                Map
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
            </>
            }
            <IonModal
                isOpen={showChatModal}
                onDidDismiss={() => setShowChatModal(false)}>
                <ChatBoard gameChatId={LobbyService.getCurrentLobby()}
                    handleClose={() => setShowChatModal(false)} />
            </IonModal>
            <IonModal
                isOpen={showLeaderBoardModal}
                onDidDismiss={() => setShowLeaderBoardModal(false)}>
                <LeaderBoard handleClose={() => setShowLeaderBoardModal(false)} teams={teams} game={game} />
            </IonModal>
            <IonModal
                className="gameMap"
                isOpen={showMap}
                onDidDismiss={() => setShowMap(false)}>
                <GameMap handleClose={() => setShowMap(false)} geolocation={geolocation} teams={teams} game={game} />
            </IonModal>
        </IonPage >

    )
}
