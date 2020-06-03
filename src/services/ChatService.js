import { fireStore } from "../firebase";
import firebase from "firebase";

export const ChatService = {
  sendMessageAll,
  sendMessageTeam,
  sendMessageAdmin,
  sendMessageAdminTeam,
};

function sendMessageAll(gameChatId, timestamp, itemMessage, fromAdmin = false) {
  return fireStore
    .collection("messages")
    .doc(gameChatId)
    .collection(gameChatId)
    .doc(timestamp + itemMessage.idFrom)
    .set({
      ...itemMessage,
      fromAdmin,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

function sendMessageTeam(gameChatId, to, timestamp, itemMessage) {
  return fireStore
    .collection("messages")
    .doc(gameChatId)
    .collection(to)
    .doc(timestamp + itemMessage.idFrom)
    .set({
      ...itemMessage,
      toTeam: to,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

function sendMessageAdminTeam(gameChatId, to, timestamp, itemMessage) {
  return fireStore
    .collection("messages")
    .doc(gameChatId)
    .collection("admin")
    .doc(timestamp + itemMessage.idFrom)
    .set({
      ...itemMessage,
      fromAdmin: true,
      toTeam: to,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(
      fireStore
        .collection("messages")
        .doc(gameChatId)
        .collection(to)
        .doc(timestamp + itemMessage.idFrom)
        .set({
          ...itemMessage,
          fromAdmin: true,
          toTeam: to,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    );
}

function sendMessageAdmin(gameChatId, to, timestamp, itemMessage) {
  return fireStore
    .collection("messages")
    .doc(gameChatId)
    .collection("admin")
    .doc(timestamp + itemMessage.idFrom)
    .set({
      ...itemMessage,
      toAdmin: true,
      toTeam: to,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(
      fireStore
        .collection("messages")
        .doc(gameChatId)
        .collection(to)
        .doc(timestamp + itemMessage.idFrom)
        .set({
          ...itemMessage,
          toAdmin: true,
          toTeam: to,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    );
}
