import { useEffect, useState } from "react";

import { LobbyService } from ".././LobbyService";
import { fireStore } from "../../firebase";

export default function useGameChanges(lobby) {
  const [finalGame, setGame] = useState();
  let unsubscribe;
  let game = undefined;
  useEffect(() => {
    console.log(lobby, LobbyService.getCurrentLobby(), "lobby?");
    unsubscribe = fireStore
      .collection("lobbies")
      .doc(lobby || LobbyService.getCurrentLobby())
      .onSnapshot(function (snapshot) {
        // game = snapshot.data();
        console.log(snapshot.data());
        setGame(snapshot.data());
      });

    return () => {
      unsubscribe();
    };
  }, []);
  return finalGame;
}
