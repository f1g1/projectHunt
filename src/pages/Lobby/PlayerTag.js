import { IonButton, IonItem, IonLabel } from '@ionic/react';
import { Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';

import BlockIcon from '@material-ui/icons/Block';
import ClearIcon from '@material-ui/icons/Clear';
import { LobbyService } from '../../services/LobbyService';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function PlayerTag(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMute = () => {
        LobbyService.mutePlayer(props.player, LobbyService.getCurrentLobby())
        setAnchorEl(null);
    }
    const handleUnmute = () => {
        LobbyService.unmutePlayer(props.player, LobbyService.getCurrentLobby())
        setAnchorEl(null);
    }
    return (
        <>
            <IonItem>
                {props.game.muted && props.game.muted.includes(props.player) && <MicOffIcon color="error" fontSize="small" />}
                <IonLabel>{props.player}</IonLabel>
                {LobbyService.ImAdmin(props.game) &&
                    <>
                        <IonButton onClick={handleClick} fill="clear">
                            <MoreVertIcon />
                        </IonButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}><ClearIcon />Kick</MenuItem>
                            {props.game.muted && props.game.muted.includes(props.player)
                                ? <MenuItem onClick={handleUnmute}><MicIcon />Unmute</MenuItem>
                                : <MenuItem onClick={handleMute}><MicOffIcon />Mute</MenuItem>}
                            <MenuItem onClick={handleClose}><IonLabel color="danger"><BlockIcon />Ban</IonLabel></MenuItem>
                        </Menu>
                    </>}

            </IonItem>
        </>
    )
}
