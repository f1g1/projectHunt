import { useEffect, useState } from "react";

import { LobbyService } from ".././LobbyService";
import { fireStore } from "../../firebase";

export default function useGameChanges(lobby) {
  const [finalGame, setGame] = useState();
  let unsubscribe;
  useEffect(() => {
    unsubscribe = fireStore
      .collection("lobbies")
      .doc(lobby || LobbyService.getCurrentLobby())
      .onSnapshot(function (snapshot) {
        setGame(snapshot.data());
      });

    return () => {
      unsubscribe();
    };
  }, []);
  return finalGame;
}
