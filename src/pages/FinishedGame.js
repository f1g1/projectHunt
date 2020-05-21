import React, { useState } from "react";

import { IonPage } from "@ionic/react";
import LeaderBoard from "./Play/LeaderBoard";
import { LobbyService } from "../services/LobbyService";

export default function FinishedGame() {
  const [game, setGame] = useState(LobbyService.getHistoryGame());
  const [teams, setTeams] = useState(LobbyService.getHistoryTeams());
  return (
    <IonPage>
      <LeaderBoard teams={teams} game={game} endGame />
    </IonPage>
  );
}
