import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonModal, IonPage, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'

import ChatBoard from '../../components/Chat/ChatBoard/ChatBoard'
import ClueList from './ClueList'
import LeaderBoard from './LeaderBoard'
import { LobbyService } from '../../services/LobbyService'
import { PlayService } from '../../services/PlayService'
import useTeamChanges from '../../services/useTeamChanges'

export default function Play(props) {
    const [game, setGame] = useState()
    const [showChatModal, setShowChatModal] = useState(false)
    const [showLeaderBoardModal, setShowLeaderBoardModal] = useState(false)
    const teams = useTeamChanges()

    useEffect(() => {
        if (props.location.lobby)
            PlayService.setGame(props.location.lobby);
        let game = PlayService.getGame();
        setGame(game);
    }, [])


    return (
        <IonPage>
            {game && <>
                <IonHeader>
                    <IonToolbar color="primary" className="ion-padding-start" >
                        <h1>
                            {game.title}
                        </h1>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <ClueList game={game} teams={teams} />
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
        </IonPage >

    )
}
