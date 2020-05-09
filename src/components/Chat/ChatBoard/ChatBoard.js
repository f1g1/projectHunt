import "./ChatBoard.css";

import {
  IonBadge,
  IonButton,
  IonButtons,
  IonImg,
  IonLabel,
  IonToolbar,
} from "@ionic/react";
import React, { Component } from "react";
import { fireStorage, fireStore } from "../../../firebase";

import CloseIcon from "@material-ui/icons/Close";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import SendIcon from "@material-ui/icons/Send";
import { UserService } from "../../../services/UserSerivce";
import moment from "moment";

export default class ChatBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowSticker: false,
      inputValue: "",
      isLoadingMessages: false,
    };
    let user = UserService.getCurrentPlayer();
    this.currentUserId = user.name;
    this.currentUserAvatar = localStorage.getItem("PHOTO_URL");
    this.currentUserNickname = user.givenName + " " + user.familyName;
    this.listMessage = [];
    this.removeListener = null;
    this.currentPhotoFile = null;
  }

  componentDidMount() {
    this.getListHistory();
  }

  componentWillUnmount() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  getListHistory = () => {
    if (this.removeListener) {
      this.removeListener();
    }
    this.listMessage.length = 0;
    this.setState({ isLoading: true });

    this.removeListener = fireStore
      .collection("messages")
      .doc(this.props.gameChatId)
      .collection(this.props.gameChatId)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              this.listMessage.push(change.doc.data());
            }
          });
          this.setState({ isLoading: false });
        },
        (err) => {
          this.props.showToast(0, err.toString());
        }
      );
  };

  onSendMessage = (content, type) => {
    if (content.trim() === "") {
      return;
    }
    const timestamp = moment().valueOf().toString();

    const itemMessage = {
      idFrom: this.currentUserId,
      idTo: this.props.gameChatId,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    };
    fireStore
      .collection("messages")
      .doc(this.props.gameChatId)
      .collection(this.props.gameChatId)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        this.setState({ inputValue: "" });
      })
      .catch((err) => {
        this.props.showToast(0, err.toString());
      });
  };

  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        this.uploadPhoto();
      } else {
        this.setState({ isLoading: false });
      }
    } else {
      this.setState({ isLoading: false });
    }
  };

  uploadPhoto = () => {
    if (this.currentPhotoFile) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = fireStorage
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile);

      uploadTask.on(
        "state_changed",
        null,
        (err) => {
          this.setState({ isLoading: false });
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      this.props.showToast(0, "File is null");
    }
  };

  onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      this.onSendMessage(this.state.inputValue, 0);
    }
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({});
    }
  };
  getPlayerTeam(player) {
    try {
      return (
        this.props.teams &&
        this.props.teams.filter((x) => x.players.includes(player))[0].name
      );
    } catch {
      return null;
    }
  }

  render() {
    return (
      <>
        <IonToolbar>
          <IonButtons>
            <IonButton onclick={this.props.handleClose}>
              <CloseIcon />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <div className="viewChatBoard">
          <div className="headerChatBoard">
            <span className="textHeaderChatBoard">Game chat!</span>
          </div>

          <div className="viewListContentChat" style={{ overflowY: "scroll" }}>
            {this.renderListMessage()}
            <div
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            />
          </div>
          {console.log(this.props.muted, "muted")}
          {!this.props.muted ? (
            <div className="viewBottom">
              <PermMediaIcon
                className="icOpenGallery"
                alt="icon open gallery"
                onClick={() => this.refInput.click()}
              />
              <input
                ref={(el) => {
                  this.refInput = el;
                }}
                accept="image/*"
                className="viewInputGallery"
                type="file"
                onChange={this.onChoosePhoto}
              />
              <input
                className="viewInput"
                placeholder="Type your message..."
                value={this.state.inputValue}
                onChange={(event) => {
                  this.setState({ inputValue: event.target.value });
                }}
                onKeyPress={this.onKeyboardPress}
              />
              <SendIcon
                className="icSend"
                alt="icon send"
                onClick={() => this.onSendMessage(this.state.inputValue, 0)}
              />
            </div>
          ) : (
            <div className="viewBottom">
              <IonLabel className="ion-text-center">
                <p>You are muted and can't reply</p>
              </IonLabel>
            </div>
          )}
          {this.state.isLoading ? <div className="viewLoading"></div> : null}
        </div>
      </>
    );
  }

  renderListMessage = () => {
    if (this.listMessage.length > 0) {
      let viewListMessage = [];
      this.listMessage.forEach((item, index) => {
        if (item.idFrom === this.currentUserId) {
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
                <div className="viewItemRight2" key={(item.timestamp = "r1")}>
                  <IonImg
                    className="imgItemRight"
                    src={item.content}
                    alt="content message"
                    onClick={() => PhotoViewer.show(item.content)}
                  />
                </div>
                <span className="textTimeRight" key={item.timestamp + "s1"}>
                  {moment(Number(item.timestamp)).format("DD/MM hh:mm")}
                </span>
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
                {this.props.owner === item.idFrom ? (
                  <IonBadge color="danger">Admin</IonBadge>
                ) : (
                  <IonBadge color="primary">
                    {this.getPlayerTeam(item.idFrom)}
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
                <div className="viewWrapItemLeft2" key={item.timestamp + "l1"}>
                  {this.props.owner === item.idFrom ? (
                    <IonBadge color="danger">Admin</IonBadge>
                  ) : (
                    <IonBadge color="primary">
                      {this.getPlayerTeam(item.idFrom)}
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
          {this.state.isLoading && (
            <span className="textSayHi">Loading messages</span>
          )}
        </div>
      );
    }
  };
}
