import "./ChatBoard.css";

import { IonButton, IonButtons, IonLoading, IonToolbar } from "@ionic/react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(
    UserService.getCurrentPlayer().name
  );
  const [openNr, setOpenNr] = useState(0);
  const ref = useRef();

  useEffect(() => {
    if (props.listMessage.length > 0) {
      MiscService.setChatNr(props.listMessage.length);
      props.setUnread(props.listMessage.length - MiscService.getChatNr());
    }
  }, [props.listMessage]);

  useEffect(() => {
    scrollToBottom();
  });
  useEffect(() => {
    scrollToBottom();
  }, [props.openChat]);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollIntoView({});
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
      {props.isLoadingMessages ? (
        <IonLoading
          isOpen={props.isLoadingMessages}
          message={"Loading messages..."}
          duration={5000}
        />
      ) : (
        <div className="viewChatBoard">
          <div className="viewListContentChat" style={{ overflowY: "scroll" }}>
            {props.listMessage.map((item, index) => {
              return item.idFrom === currentUserId ? (
                <MessageOut item={item} owner={props.lobby.owner} />
              ) : (
                <MessageIn
                  item={item}
                  owner={props.lobby.owner}
                  team={
                    LobbyService.getPlayerTeam(item.idFrom, props.teams) &&
                    LobbyService.getPlayerTeam(item.idFrom, props.teams).name
                  }
                />
              );
            })}
            <div ref={ref} className="TestTOSCROLL" />
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
      )}
    </>
  );
}
