import "./ChatBoard.css";

import {
  IonBadge,
  IonButton,
  IonButtons,
  IonImg,
  IonLabel,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { fireStorage, fireStore } from "../../../firebase";

import CloseIcon from "@material-ui/icons/Close";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import SendIcon from "@material-ui/icons/Send";
import { UserService } from "../../../services/UserSerivce";
import moment from "moment";

export default function ChatBoard(props) {
  const [isLoading, setIsLoading] = useState();
  const [inputValue, setInputValue] = useState();
  const [isLoadingMessage, setIsLoadingMessage] = useState();
  const [listMessage, setListMessage] = useState([]);
  const ref = useRef();
  let refInput = useRef(null);

  let user = UserService.getCurrentPlayer();
  let currentUserId = user.name;

  let removeListener = null;
  let currentPhotoFile = null;

  useEffect(() => {
    getListHistory();
    return () => {
      if (removeListener) removeListener();
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [listMessage]);
  const getListHistory = () => {
    if (removeListener) {
      removeListener();
    }
    listMessage.length = 0;
    setIsLoading(true);
    removeListener = fireStore
      .collection("messages")
      .doc(props.gameChatId)
      .collection(props.gameChatId)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              listMessage.push(change.doc.data());
            }
          });
          setIsLoading(false);
        },
        (err) => {
          props.showToast(0, err.toString());
        }
      );
  };

  const onSendMessage = (content, type) => {
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
    fireStore
      .collection("messages")
      .doc(props.gameChatId)
      .collection(props.gameChatId)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        setInputValue("");
      })
      .catch((err) => {
        props.showToast(0, err.toString());
      });
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
  const getPlayerTeam = (player) => {
    try {
      return (
        props.teams &&
        props.teams.filter((x) => x.players.includes(player))[0].name
      );
    } catch {
      return null;
    }
  };
  const renderListMessage = () => {
    if (listMessage.length > 0) {
      let viewListMessage = [];
      listMessage.forEach((item, index) => {
        if (item.idFrom === currentUserId) {
          // Item right (my message)
          if (item.type === 0) {
            viewListMessage.push(
              <>
                <div className="viewItemRight" key={item.timestamp + "r"}>
                  <span className="textContentItem">{item.content}</span>
                </div>
                <span className="textTimeRight" key={item.timestamp + "s"}>
                  {moment(Number(item.timestamp)).format("DD/MM hh:mm")}
                </span>
              </>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <>
                <div className="viewItemRight2" key={item.timestamp + "r1"}>
                  <IonImg
                    className="imgItemRight"
                    src={item.content}
                    alt="content message"
                    onClick={() => PhotoViewer.show(item.content)}
                  />
                </div>
                <span className="textTimeRight" key={item.timestamp + "s1"}>
                  {moment(Number(item.timestamp)).format("DD/MM hh:mm")}
                </span>{" "}
              </>
            );
          }
        } else {
          // Item left (peer message)
          if (item.type === 0) {
            viewListMessage.push(
              <div
                className="viewWrapItemLeft ion-padding-bottom"
                key={item.timestamp + "l"}
              >
                {props.owner === item.idFrom ? (
                  <IonBadge color="danger">Admin</IonBadge>
                ) : (
                  <IonBadge color="primary">
                    {getPlayerTeam(item.idFrom)}
                  </IonBadge>
                )}
                <div className="viewItemLeft">
                  <span className="textContentItem">{item.content}</span>
                </div>
                <span className="textTimeLeft">
                  {item.idFrom}{" "}
                  {moment(Number(item.timestamp)).format("DD/MM hh:mm")}
                </span>
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <>
                <div
                  className="viewWrapItemLeft ion-padding-bottom"
                  key={item.timestamp + "l"}
                >
                  {props.owner === item.idFrom ? (
                    <IonBadge color="danger">Admin</IonBadge>
                  ) : (
                    <IonBadge color="primary">
                      {getPlayerTeam(item.idFrom)}
                    </IonBadge>
                  )}
                  <div className="viewItemLeft2">
                    <IonImg
                      className="imgItemLeft"
                      src={item.content}
                      alt="content message"
                      onClick={() => PhotoViewer.show(item.content)}
                    />
                  </div>
                  <span className="textTimeLeft">
                    {item.idFrom}{" "}
                    {moment(Number(item.timestamp)).format("DD/MM hh:mm")}
                  </span>
                </div>
              </>
            );
          }
        }
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
        {console.log(props.muted, "muted")}
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
