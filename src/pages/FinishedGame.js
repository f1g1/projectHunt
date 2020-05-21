import React, { useEffect, useState } from "react";

import { IonPage } from "@ionic/react";
import LeaderBoard from "./Play/LeaderBoard";
import { LobbyService } from "../services/LobbyService";

export default function FinishedGame() {
  const [game, setGame] = useState(LobbyService.getLocalHistoryGame());
  const [teams, setTeams] = useState(LobbyService.getLocalHistoryTeams());
  useEffect(() => {
    return () => {
      LobbyService.setLocalHistoryGame();
      LobbyService.setLocalHistoryTeams();
    };
  }, []);
  return (
    <IonPage>
      <LeaderBoard teams={teams} game={game} endGame />
    </IonPage>
  );
}
