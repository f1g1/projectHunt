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
    newTeam &&
      LobbyService.playerJoinTeam(
        LobbyService.getCurrentLobby(),
        newTeam,
        props.playerName
      );
  };
  const getCurrentTeam = () => {
    debugger;
    try {
      return (
        props.teams &&
        props.teams.filter((x) => x.players.includes(props.playerName))[0].name
      );
    } catch {
      return null;
    }
  };
  return (
    <>
      <IonRow
        style={isCurrentPlayer() ? { color: "#008b8b", opacity: 0.6 } : null}
        style={{ borderBottom: "1px solid black" }}
      >
        <IonCol style={{ margin: "auto", verticalAlign: "middle" }}>
          {props.game.muted && props.game.muted.includes(props.playerName) && (
            <MicOffIcon color="error" fontSize="small" />
          )}
          <IonLabel>{props.playerName}</IonLabel>
        </IonCol>
        {LobbyService.ImAdmin(props.game) && (
          <>
            {!isCurrentPlayer() && (
              <>
                <IonCol>
                  {props.advanced && LobbyService.ImAdmin(props.game) ? (
                    <IonSelect
                      interface="popover"
                      value={getCurrentTeam()}
                      onIonChange={(e) =>
                        changeTeam(getCurrentTeam(), e.detail.value)
                      }
                    >
                      <IonSelectOption value="null">
                        --no team--
                      </IonSelectOption>
                      {props.teams.map((x) => (
                        <IonSelectOption value={x.name}>
                          {x.name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  ) : (
                    <IonLabel>{getCurrentTeam()}</IonLabel>
                  )}
                </IonCol>
                <IonCol className="ion-text-end">
                  <IonButton
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
                    <MenuItem
                      onClick={() => {
                        props.handleKick(props.playerName);
                        console.log("Initiaded kick");
                      }}
                    >
                      <ClearIcon />
                      Kick
                    </MenuItem>
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
                    <MenuItem onClick={handleClose}>
                      <IonLabel color="danger">
                        <BlockIcon />
                        Ban
                      </IonLabel>
                    </MenuItem>
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
