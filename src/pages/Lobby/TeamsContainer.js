import "./Lobby.scss";

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonToast,
} from "@ionic/react";
import React, { Fragment, useState } from "react";

import { LobbyService } from "../../services/LobbyService";
import TeamPanel from "./TeamPanel";
import { UserService } from "../../services/UserSerivce";

export default function TeamsContainer(props) {
  const [newTeamName, setnewTeamName] = useState();
  const [errorToast, setErrorToast] = useState();
  const addTeam = () => {
    LobbyService.addTeam(
      LobbyService.getCurrentLobby(),
      newTeamName,
      UserService.getCurrentPlayer().name,
      props.isAdmin
    )
      .then(() => {
        setnewTeamName();
      })
      .catch((x) => {
        setErrorToast("Something went wron when creating team, try again!");
      });
    // !props.isAdmin && LobbyService.setCurrentTeam(newTeamName);
  };

  return (
    <IonCard>
      <IonCardContent>
        <IonCardTitle>Teams</IonCardTitle>
        <IonList>
          {props.teams
            .sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
            .map((team, index) => {
              return (
                <Fragment key={team.name}>
                  <IonItem
                    detail={
                      !(
                        props.currentTeamDetails &&
                        props.currentTeamDetails.name === team.name
                      )
                    }
                    lines="none"
                    color={
                      props.currentTeamDetails &&
                      props.currentTeamDetails.name === team.name
                        ? "secondary"
                        : "primary"
                    }
                    button={true}
                    onClick={() => props.showThisTeam(team.name)}
                    key={team.name + index + "das"}
                  >
                    <IonLabel
                      color={
                        (team.players.length / props.max === 1 && "danger") ||
                        "light"
                      }
                    >
                      <h5>
                        {team.players.length}/{props.max} players
                      </h5>
                    </IonLabel>
                    <h2 className="ion-padding-horizontal"> {team.name}</h2>
                  </IonItem>
                  {props.currentTeamDetails &&
                    props.currentTeamDetails.name === team.name && (
                      <TeamPanel
                        handleKick={props.handleKick}
                        team={team}
                        max={props.lobby.maxPlayers}
                        game={props.lobby}
                        leaveTeam={props.leaveTeam}
                        canJoin={props.joinedTeam}
                        joinTeam={props.joinTeam}
                        isAdmin={LobbyService.ImAdmin(props.lobby)}
                        handleBan={props.handleBan}
                      ></TeamPanel>
                    )}
                  <IonItemDivider key={team.name + index} />
                </Fragment>
              );
            })}
          <IonItem>
            <IonInput
              placeholder="TeamName"
              maxlength="20"
              minlength="3"
              type="text"
              value={newTeamName}
              onIonChange={(e) => setnewTeamName(e.detail.value)}
              disabled={props.joinedTeam}
            ></IonInput>
            <IonButton
              shape="round"
              onClick={addTeam}
              size="default"
              disabled={
                props.joinedTeam || !newTeamName || newTeamName.length < 3
              }
            >
              New team!
            </IonButton>
          </IonItem>
        </IonList>
      </IonCardContent>
      <IonToast
        color="danger"
        position="top"
        isOpen={errorToast !== undefined}
        onDidDismiss={() => setErrorToast()}
        message={errorToast}
        duration={2000}
      />
    </IonCard>
  );
}
