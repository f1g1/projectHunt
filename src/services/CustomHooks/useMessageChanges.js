import { useEffect, useState } from "react";

import { LobbyService } from "../LobbyService";
import { UserService } from "../UserSerivce";
import { fireStore } from "../../firebase";

export default function useMessageChanges(teams, gameChatId, lobby, openChat) {
  const [finalMessages, setMessages] = useState([]);
  let unsubscribe;
  let unsubsscribeC;
  let messages = [];
  const getPlayerTeam = (player) => {
    try {
      debugger;
      return teams && teams.filter((x) => x.players.includes(player))[0].name;
    } catch {
      return null;
    }
  };
  useEffect(() => {
    if (openChat === 1) {
      debugger;
      messages = messages;
      unsubscribe = fireStore
        .collection("messages")
        .doc(gameChatId)
        .collection(gameChatId)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              debugger;
              messages = [...messages, { ...change.doc.data() }];
              setMessages([
                ...messages.sort((x, y) => x.timestamp - y.timestamp),
              ]);
            }
          });
        });
      if (LobbyService.ImAdmin(lobby))
        unsubsscribeC = fireStore
          .collection("messages")
          .doc(gameChatId)
          .collection("admin")
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                messages = [...messages, { ...change.doc.data() }];

                setMessages([
                  ...messages.sort((x, y) => x.timestamp - y.timestamp),
                ]);
              }
            });
          });
      else {
        unsubsscribeC = fireStore
          .collection("messages")
          .doc(gameChatId)
          .collection(getPlayerTeam(UserService.getCurrentPlayer().name))
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                messages = [...messages, { ...change.doc.data() }];

                setMessages([
                  ...messages.sort((x, y) => x.timestamp - y.timestamp),
                ]);
              }
            });
          });
      }
    }
  }, [openChat]);
  useEffect(() => {
    return () => {
      unsubscribe && unsubscribe();
      unsubsscribeC && unsubsscribeC();
    };
  }, []);

  return finalMessages.sort((x) => x.timestamp);
}
