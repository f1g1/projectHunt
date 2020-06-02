import { IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useRef, useState } from "react";

import { ChatService } from "../../../services/ChatService";
import { LobbyService } from "../../../services/LobbyService";
import MiscService from "../../../services/MiscService";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import SendIcon from "@material-ui/icons/Send";
import { UserService } from "../../../services/UserSerivce";
import { fireStorage } from "../../../firebase";
import moment from "moment";

export default function ChatInput(props) {
  const [inputValue, setInputValue] = useState();
  const [currentUserId, currentUserID] = useState(
    UserService.getCurrentPlayer().name
  );
  let currentPhotoFile = null;
  let refInput = useRef(null);

  const onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      onSendMessage(inputValue, 0);
    }
  };
  const onSendMessage = (content, type) => {
    if (!content) content = "";
    if (content.trim() === "") {
      return;
    }
    MiscService.setChatNr(props.listMessage.length + 1);

    props.setUnread(props.listMessage.length + 1 - MiscService.getChatNr());

    const timestamp = moment().valueOf().toString();

    const itemMessage = {
      idFrom: currentUserId,
      idTo: props.gameChatId,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    };

    let myTeam;
    let gameChatId = props.gameChatId;
    switch (props.chatMessageType) {
      case "all":
        ChatService.sendMessageAll(
          gameChatId,
          timestamp,
          itemMessage,
          LobbyService.ImAdmin(props.lobby)
        );
        break;
      case undefined:
        ChatService.sendMessageAll(
          gameChatId,
          timestamp,
          itemMessage,
          LobbyService.ImAdmin(props.lobby)
        );
        break;
      case "team":
        myTeam = LobbyService.getPlayerTeam(
          UserService.getCurrentPlayer().name,
          props.teams
        ).name;
        ChatService.sendMessageTeam(gameChatId, myTeam, timestamp, itemMessage);
        break;
      case "admin":
        myTeam = LobbyService.getPlayerTeam(
          UserService.getCurrentPlayer().name,
          props.teams
        ).name;
        ChatService.sendMessageAdmin(
          gameChatId,
          myTeam,
          timestamp,
          itemMessage
        );
        break;

      default:
        ChatService.sendMessageAdminTeam(
          gameChatId,
          props.chatMessageType,
          timestamp,
          itemMessage
        );
        break;
    }
    setInputValue("");
  };

  const onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      props.setIsLoading(true);
      currentPhotoFile = event.target.files[0];
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        uploadPhoto();
      } else {
        props.setIsLoading(false);
      }
    } else {
      props.setIsLoading(false);
    }
  };

  const uploadPhoto = () => {
    if (currentPhotoFile) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = fireStorage
        .ref()
        .child(timestamp)
        .put(currentPhotoFile);

      uploadTask.on(
        "state_changed",
        null,
        (err) => {
          props.setIsLoading(false);
          props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            props.setIsLoading(false);
            onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      props.setIsLoading(false);
      props.showToast(0, "File is null");
    }
  };

  return (
    <>
      {props.muted && console.log("muted")}
      {!props.muted ? (
        <div className="viewBottom">
          <PermMediaIcon
            className="icOpenGallery"
            alt="icon open gallery"
            onClick={() => refInput.current.click()}
          />
          <input
            ref={refInput}
            accept="image/*"
            className="viewInputGallery"
            type="file"
            onChange={onChoosePhoto}
          />

          {props.started && (
            <IonSelect
              interface="popover"
              value={props.chatMessageType}
              onIonChange={(e) =>
                props.chatMessageType &&
                props.setChatMessageType(e.target.value)
              }
            >
              {!LobbyService.ImAdmin(props.lobby) ? (
                <>
                  <IonSelectOption value="all">All</IonSelectOption>
                  <IonSelectOption value="team">Team</IonSelectOption>
                  <IonSelectOption value="admin">Admin</IonSelectOption>
                </>
              ) : (
                <>
                  <IonSelectOption value="all">All</IonSelectOption>

                  {props.teams &&
                    props.teams.map((x) => {
                      return (
                        <IonSelectOption value={x.name} lines="none">
                          {x.name}
                        </IonSelectOption>
                      );
                    })}
                </>
              )}
            </IonSelect>
          )}
          <input
            className="viewInput"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            onKeyPress={onKeyboardPress}
          />
          <SendIcon
            className="icSend"
            alt="icon send"
            onClick={() => onSendMessage(inputValue, 0)}
          />
        </div>
      ) : (
        <div className="viewBottom">
          <IonLabel className="ion-text-center">
            <p>You are muted and can't reply</p>
          </IonLabel>
        </div>
      )}
    </>
  );
}
