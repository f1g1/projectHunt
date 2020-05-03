import { useEffect, useState } from 'react';

import { LobbyService } from '.././LobbyService';
import { fireStore } from '../../firebase';

export default function useGameChanges(lobby) {
    const [finalGame, setGame] = useState();
    let unsubscribe;
    let game = undefined;
    useEffect(() => {
        unsubscribe = fireStore
            .collection("lobbies")
            .doc(lobby || LobbyService.getCurrentLobby())
            .onSnapshot(function (snapshot) {
                game = snapshot.data();
                setGame(game)
            });

        return () => {
            unsubscribe();
        }
    }, [])
    return finalGame;
}
