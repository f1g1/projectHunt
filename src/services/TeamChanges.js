import React, { useState, useEffect } from 'react'
import { fireStore } from '../firebase';
import { LobbyService } from './LobbyService';

export default function useTeamChanges() {
    let teams = []
    const [teamss, setteamss] = useState([])
    useEffect(() => {

        let unsubscribe = fireStore
            .collection("lobbies")
            .doc(LobbyService.getCurrentLobby())
            .collection("teams")
            .onSnapshot(function (snapshot) {
                snapshot.docChanges().forEach(function (change) {
                    if (change.type === "added") {
                        teams = [...teams, { ...change.doc.data(), name: change.doc.id }];
                        setteamss(teams);
                    }
                    if (change.type === "modified") {
                        debugger;
                        let filtered = teams.filter(x => x.name === change.doc.data().name)
                        teams = [...filtered, { ...change.doc.data(), name: change.doc.id }];
                        setteamss(teams);
                    }
                    if (change.type === "removed") {
                        let filtered = teams.filter(x => x.name === change.doc.data().name)
                        teams = [...filtered];
                        setteamss(teams);
                    }
                });
            });
        return () => {
            unsubscribe();
        }
    }, [])
    return teamss;
}
