import {
  IonButton,
  IonCol,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { Menu, MenuItem } from "@material-ui/core";
import React, { useState } from "react";

import BlockIcon from "@material-ui/icons/Block";
import ClearIcon from "@material-ui/icons/Clear";
import { LobbyService } from "../../services/LobbyService";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { UserService } from "../../services/UserSerivce";

export default function PlayerTag(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMute = () => {
    LobbyService.mutePlayer(props.playerName, LobbyService.getCurrentLobby());
    setAnchorEl(null);
  };
  const handleUnmute = () => {
    LobbyService.unmutePlayer(props.playerName, LobbyService.getCurrentLobby());
    setAnchorEl(null);
  };
  const isCurrentPlayer = () => {
    return UserService.getCurrentPlayer().name === props.playerName;
  };
  const changeTeam = (oldTeam, newTeam) => {
    let players =
      oldTeam && props.teams.find((x) => x.name == oldTeam).players.length;
    oldTeam &&
      LobbyService.leaveTeam(
        LobbyService.getCurrentLobby(),
        oldTeam,
        props.playerName
      );
    props.playerName &&
      newTeam &&
      LobbyService.playerJoinTeam(
        LobbyService.getCurrentLobby(),
        newTeam,
        props.playerName
      );
  };
  const getCurrentTeam = () => {
    try {
      return props.teams.find((x) => x.players.includes(props.playerName)).name;
    } catch {
      return null;
    }
  };
  const getLabelCurrentTeam = (player) => {
    return <IonLabel>{getCurrentTeam()}</IonLabel>;
  };
  return (
    <>
      <IonRow
        style={
          isCurrentPlayer()
            ? { color: "#508b8b", borderBottom: "1px solid black" }
            : { borderBottom: "1px solid black" }
        }
        className="ion-justify-content-center"
      >
        <IonCol style={{ margin: "auto", verticalAlign: "middle" }}>
          {props.game.muted && props.game.muted.includes(props.playerName) && (
            <MicOffIcon color="error" fontSize="small" />
          )}
          <IonLabel className="ion-padding-left">{props.playerName}</IonLabel>
        </IonCol>

        {!isCurrentPlayer() && (
          <>
            <IonCol>
              {LobbyService.ImAdmin(props.game) ? (
                <IonSelect
                  disabled={props.play}
                  interface="popover"
                  value={getCurrentTeam()}
                  onIonChange={(e) =>
                    changeTeam(getCurrentTeam(), e.detail.value)
                  }
                >
                  <IonSelectOption value="null" key="noteam">
                    --no team--
                  </IonSelectOption>
                  {props.teams.map((x) => (
                    <IonSelectOption value={x.name} key={x.name}>
                      {x.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              ) : (
                getLabelCurrentTeam(props.playerName)
              )}
            </IonCol>

            {LobbyService.ImAdmin(props.game) && (
              <>
                <IonCol className="ion-text-end">
                  <IonButton
                    shape="round"
                    className="ion-float-right"
                    onClick={handleClick}
                    fill="clear"
                    className="ion-no-padding"
                  >
                    <MoreVertIcon />
                  </IonButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {!props.play && (
                      <MenuItem
                        onClick={() => {
                          props.handleKick(props.playerName);
                          console.log("Initiaded kick");
                        }}
                      >
                        <ClearIcon />
                        Kick
                      </MenuItem>
                    )}
                    {props.game.muted &&
                    props.game.muted.includes(props.playerName) ? (
                      <MenuItem onClick={handleUnmute}>
                        <MicIcon />
                        Unmute
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={handleMute}>
                        <MicOffIcon />
                        Mute
                      </MenuItem>
                    )}
                    {!props.play && (
                      <MenuItem
                        onClick={() => props.handleBan(props.playerName)}
                      >
                        <IonLabel color="danger">
                          <BlockIcon />
                          Ban
                        </IonLabel>
                      </MenuItem>
                    )}
                  </Menu>
                </IonCol>
              </>
            )}
          </>
        )}
      </IonRow>
    </>
  );
}
