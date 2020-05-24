import { useEffect, useState } from "react";

import { LobbyService } from "../LobbyService";
import { fireStore } from "../../firebase";

export default function useTeamChanges(lobby) {
  const [finalteams, setTeams] = useState([]);
  let unsubscribe;
  let teams = [];
  useEffect(() => {
    teams = teams;
    unsubscribe = fireStore
      .collection("lobbies")
      .doc(lobby || LobbyService.getCurrentLobby())
      .collection("teams")
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            teams = [...teams, { ...change.doc.data(), name: change.doc.id }];
            setTeams([...teams]);
          }
          if (change.type === "modified") {
            let modified = teams.filter((x) => x.name !== change.doc.id);
            teams = [
              ...modified,
              { ...change.doc.data(), name: change.doc.id },
            ];
            setTeams([...teams]);
          }
          if (change.type === "removed") {
            let filtered = teams.filter((x) => x.name !== change.doc.id);
            teams = [...filtered];
            setTeams([...teams]);
          }
        });
      });

    return () => {
      unsubscribe();
    };
  }, []);
  return finalteams;
}
