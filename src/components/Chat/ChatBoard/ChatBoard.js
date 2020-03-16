import moment from 'moment'
import React, { Component } from 'react'
import './ChatBoard.css'
import { fireStore, fireStorage } from '../../../firebase'
import { UserService } from '../../../services/UserSerivce'
import { IonIcon, IonButton } from '@ionic/react'
import { images, send } from "ionicons/icons"
export default class ChatBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowSticker: false,
            inputValue: ''
        }
        let user = UserService.getCurrentUser();
        this.currentUserId = user.id
        this.currentUserAvatar = localStorage.getItem("PHOTO_URL")
        this.currentUserNickname = user.givenName + " " + user.familyName
        this.listMessage = []
        // this.props.gameChatId = { id: "1" }
        this.removeListener = null
        this.currentPhotoFile = null
    }

    componentDidUpdate() {
        // this.scrollToBottom()
    }

    componentDidMount() {
        // For first render, it's not go through componentWillReceiveProps
        this.getListHistory()
    }

    componentWillUnmount() {
        if (this.removeListener) {
            this.removeListener()
        }
    }


    getListHistory = () => {
        if (this.removeListener) {
            this.removeListener()
        }
        this.listMessage.length = 0
        this.setState({ isLoading: true })
        // if (
        //     this.hashString(this.currentUserId) <=
        //     this.hashString(this.props.gameChatId)
        // ) {
        //     this.props.gameChatId = `${this.currentUserId}-${this.props.gameChatId}`
        // } else {
        //     this.props.gameChatId = `${this.props.gameChatId}-${this.currentUserId}`
        // }

        // Get history and listen new data added
        this.removeListener = fireStore
            .collection("messages")
            .doc(this.props.gameChatId)
            .collection(this.props.gameChatId)
            .onSnapshot(
                snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === "added") {
                            this.listMessage.push(change.doc.data())
                        }
                    })
                    this.setState({ isLoading: false })
                },
                err => {
                    this.props.showToast(0, err.toString())
                }
            )
    }



    onSendMessage = (content, type) => {


        if (content.trim() === '') {
            return
        }

        const timestamp = moment()
            .valueOf()
            .toString()

        const itemMessage = {
            idFrom: this.currentUserId,
            idTo: this.props.gameChatId,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        }
        fireStore.collection("messages")
            .doc(this.props.gameChatId)
            .collection(this.props.gameChatId)
            .doc(timestamp)
            .set(itemMessage)
            .then(() => {
                this.setState({ inputValue: '' })
            })
            .catch(err => {
                this.props.showToast(0, err.toString())
            })
    }

    onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ isLoading: true })
            this.currentPhotoFile = event.target.files[0]
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf('image/') === 0) {
                this.uploadPhoto()
            } else {
                this.setState({ isLoading: false })
                console.log('This file is not an image')
            }
        } else {
            this.setState({ isLoading: false })
        }
    }

    uploadPhoto = () => {
        if (this.currentPhotoFile) {
            const timestamp = moment()
                .valueOf()
                .toString()

            const uploadTask = fireStorage
                .ref()
                .child(timestamp)
                .put(this.currentPhotoFile)

            uploadTask.on(
                "state_changed",
                null,
                err => {
                    this.setState({ isLoading: false })
                    this.props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.setState({ isLoading: false })
                        this.onSendMessage(downloadURL, 1)
                    })
                }
            )
        } else {
            this.setState({ isLoading: false })
            this.props.showToast(0, 'File is null')
        }
    }

    onKeyboardPress = event => {
        if (event.key === 'Enter') {
            this.onSendMessage(this.state.inputValue, 0)
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
    }

    render() {
        return (
            <div className="viewChatBoard">
                <div className="headerChatBoard">

                    <span className="textHeaderChatBoard">
                        Game chat!
                    </span>
                </div>

                <div className="viewListContentChat">
                    {this.renderListMessage()}
                    <div
                        style={{ float: 'left', clear: 'both' }}
                        ref={el => {
                            this.messagesEnd = el
                        }}
                    />
                </div>


                <div className="viewBottom">

                    <IonIcon
                        icon={images}
                        className="icOpenGallery"
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        ref={el => {
                            this.refInput = el
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
                        onChange={event => {
                            this.setState({ inputValue: event.target.value })
                        }}
                        onKeyPress={this.onKeyboardPress}
                    />
                    <IonIcon
                        icon={send}
                        className="icSend"
                        alt="icon send"
                        onClick={() => this.onSendMessage(this.state.inputValue, 0)}
                    />
                </div>
                {this.state.isLoading ? (
                    <div className="viewLoading">
                        sending...
                    </div>
                ) : null}
            </div>
        )
    }

    renderListMessage = () => {
        if (this.listMessage.length > 0) {
            let viewListMessage = []
            this.listMessage.forEach((item, index) => {
                if (item.idFrom === this.currentUserId) {
                    // Item right (my message)
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={item.content}
                                    alt="content message"
                                />
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={this.getGifImage(item.content)}
                                    alt="content message"
                                />
                            </div>
                        )
                    }
                } else {
                    // Item left (peer message)
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <IonButton>s</IonButton>
                                        // <img
                                        //     src={this.props.gameChatId.image}
                                        //     alt="avatar"
                                        //     className="peerAvatarLeft"
                                        // />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('ll')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.props.gameChatId.photoUrl}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft2">
                                        <img
                                            className="imgItemLeft"
                                            src={item.content}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('ll')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.props.gameChatId.photoUrl}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                        <img
                                            className="imgItemLeft"
                                            src={this.getGifImage(item.content)}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('ll')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    }
                }
            })
            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Loading messages</span>

                </div>
            )
        }
    }



    // hashString = str => {
    //     let hash = 0
    //     for (let i = 0; i < str.length; i++) {
    //         hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
    //         hash = hash & hash // Convert to 32bit integer
    //     }
    //     return hash
    // }



    isLastMessageLeft(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom === this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }

    isLastMessageRight(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom !== this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }
}
