import { fireStore } from "../firebase";

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
    .set({ ...itemMessage, fromAdmin });
}

function sendMessageTeam(gameChatId, to, timestamp, itemMessage) {
  return fireStore
    .collection("messages")
    .doc(gameChatId)
    .collection(to)
    .doc(timestamp + itemMessage.idFrom)
    .set({ ...itemMessage, toTeam: to });
}

function sendMessageAdminTeam(gameChatId, to, timestamp, itemMessage) {
  return fireStore
    .collection("messages")
    .doc(gameChatId)
    .collection("admin")
    .doc(timestamp + itemMessage.idFrom)
    .set({ ...itemMessage, fromAdmin: true, toTeam: to })
    .then(
      fireStore
        .collection("messages")
        .doc(gameChatId)
        .collection(to)
        .doc(timestamp + itemMessage.idFrom)
        .set({ ...itemMessage, fromAdmin: true, toTeam: to })
    );
}

function sendMessageAdmin(gameChatId, to, timestamp, itemMessage) {
  return fireStore
    .collection("messages")
    .doc(gameChatId)
    .collection("admin")
    .doc(timestamp + itemMessage.idFrom)
    .set({ ...itemMessage, toAdmin: true, toTeam: to })
    .then(
      fireStore
        .collection("messages")
        .doc(gameChatId)
        .collection(to)
        .doc(timestamp + itemMessage.idFrom)
        .set({ ...itemMessage, toAdmin: true, toTeam: to })
    );
}
