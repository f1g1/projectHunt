import { IonButton, IonCol, IonRow } from "@ionic/react";

import { LobbyService } from "../../services/LobbyService";
import PlayerTag from "./PlayerTag";
import React from "react";
import { UserService } from "../../services/UserSerivce";

export default function TeamPanel(props) {
  const disbandTeam = (team) => {
    LobbyService.disbandTeam(LobbyService.getCurrentLobby(), team);
  };
  return (
    <div color="primary">
      {props.team && (
        <>
          {props.team.players.map((x, index) => (
            <IonRow key={x}>
              <IonCol>
                <PlayerTag
                  handleKick={props.handleKick}
                  team={props.team}
                  playerName={props.team.players[index]}
                  game={props.game}
                  key={props.team.players[index]}
                  handleBan={props.handleBan}
                />
              </IonCol>
            </IonRow>
          ))}
          {!props.isAdmin ? (
            !props.team.players.filter(
              (x) => x === UserService.getCurrentPlayer().name
            ).length > 0 ? (
              <IonButton
                color="primary"
                expand="full"
                disabled={props.canJoin || props.team.length / props.max === 1}
                onClick={() => props.joinTeam(props.team.name)}
              >
                Join!
              </IonButton>
            ) : (
              <IonButton
                disabled="false"
                expand="full"
                color="danger"
                onClick={() =>
                  props.leaveTeam(
                    LobbyService.getCurrentLobby(),
                    UserService.getCurrentPlayer().name,
                    props.team
                  )
                }
              >
                Leave!
              </IonButton>
            )
          ) : (
            <IonButton
              expand="full"
              color="danger"
              onClick={() => disbandTeam(props.team.name)}
            >
              Disband
            </IonButton>
          )}
        </>
      )}
    </div>
  );
}
