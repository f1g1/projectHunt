import "./ChatBoard.css";

import {
  IonButton,
  IonButtons,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import { ChatService } from "../../../services/ChatService";
import CloseIcon from "@material-ui/icons/Close";
import { LobbyService } from "../../../services/LobbyService";
import MessageIn from "./MessageIn";
import MessageOut from "./MessageOut";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import SendIcon from "@material-ui/icons/Send";
import { UserService } from "../../../services/UserSerivce";
import { fireStorage } from "../../../firebase";
import moment from "moment";

const typeMessages = {
  0: "all",
  1: "team",
  2: "admin",
};

export default function ChatBoard(props) {
  const [isLoading, setIsLoading] = useState();
  const [inputValue, setInputValue] = useState();
  const ref = useRef();
  let refInput = useRef(null);

  let user = UserService.getCurrentPlayer();
  let currentUserId = user.name;

  let currentPhotoFile = null;

  useEffect(() => {
    scrollToBottom();
  }, [props.listMessage]);

  const onSendMessage = (content, type) => {
    if (!content) content = "";
    if (content.trim() === "") {
      return;
    }
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
      setIsLoading(true);
      currentPhotoFile = event.target.files[0];
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        uploadPhoto();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
          setIsLoading(false);
          props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setIsLoading(false);
            onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      setIsLoading(false);
      props.showToast(0, "File is null");
    }
  };

  const onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      onSendMessage(inputValue, 0);
    }
  };

  const scrollToBottom = () => {
    if (ref) {
      ref.current.scrollIntoView({});
    }
  };

  const renderListMessage = () => {
    if (props.listMessage.length > 0) {
      let viewListMessage = [];
      props.listMessage.forEach((item, index) => {
        item.idFrom === currentUserId
          ? viewListMessage.push(
              <MessageOut item={item} owner={props.lobby.owner} />
            )
          : viewListMessage.push(
              <MessageIn
                item={item}
                owner={props.lobby.owner}
                team={
                  LobbyService.getPlayerTeam(item.idFrom, props.teams) &&
                  LobbyService.getPlayerTeam(item.idFrom, props.teams).name
                }
              />
            );
      });
      return viewListMessage;
    } else {
      return (
        <div className="viewWrapSayHi">
          {isLoading && <span className="textSayHi">Loading messages</span>}
        </div>
      );
    }
  };

  return (
    <>
      <IonToolbar>
        <IonButtons>
          <IonButton onclick={props.handleClose}>
            <CloseIcon />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <div className="viewChatBoard">
        <div className="headerChatBoard">
          <span className="textHeaderChatBoard">Game chat!</span>
        </div>

        <div className="viewListContentChat" style={{ overflowY: "scroll" }}>
          {renderListMessage()}
          <div style={{ float: "left", clear: "both" }} ref={ref} />
        </div>
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
        {isLoading ? <div className="viewLoading"></div> : null}
      </div>
    </>
  );
}
