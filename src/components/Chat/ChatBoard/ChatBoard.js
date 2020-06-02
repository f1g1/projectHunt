import "./ChatBoard.css";

import { IonButton, IonButtons, IonToolbar } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import ChatInput from "./ChatInput";
import CloseIcon from "@material-ui/icons/Close";
import { LobbyService } from "../../../services/LobbyService";
import MessageIn from "./MessageIn";
import MessageOut from "./MessageOut";
import MiscService from "../../../services/MiscService";
import { UserService } from "../../../services/UserSerivce";

const typeMessages = {
  0: "all",
  1: "team",
  2: "admin",
};

export default function ChatBoard(props) {
  const [isLoading, setIsLoading] = useState();
  const [currentUserId, currentUserID] = useState(
    UserService.getCurrentPlayer().name
  );
  const ref = useRef();

  useEffect(() => {
    if (props.listMessage.length > 0) {
      MiscService.setChatNr(props.listMessage.length);
      props.setUnread(props.listMessage.length - MiscService.getChatNr());
    }
  }, [props.listMessage]);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollIntoView({});
    }
  };

  const renderListMessage = () => {
    console.log("renderlistmessages");
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
            <div className="headerChatBoard">
              <span className="textHeaderChatBoard">Game chat!</span>
            </div>
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <div className="viewChatBoard">
        <div className="viewListContentChat" style={{ overflowY: "scroll" }}>
          {renderListMessage()}
          <div ref={ref} />
          {scrollToBottom()}
        </div>
        <ChatInput
          listMessage={props.listMessage}
          setUnread={props.setUnread}
          gameChatId={props.gameChatId}
          lobby={props.lobby}
          chatMessageType={props.chatMessageType}
          showToast={props.showToast}
          muted={props.muted}
          teams={props.teams}
          setIsLoading={setIsLoading}
          started={props.started}
          setChatMessageType={props.setChatMessageType}
        />
        {isLoading ? <div className="viewLoading"></div> : null}
      </div>
    </>
  );
}
