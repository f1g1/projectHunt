import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from "firebase";

const axios = require("axios").default;

export const VISIBILITY = {
  public: "public",
  code: "code",
};

export const LobbyService = {
  postLobby,
  getLobbies,
  deleteLobby,
  getLobby,
  getCurrentLobby,
  leaveLobby,
  playerJoinTeam,
  leaveTeam,
  addTeam,
  getTeams,
  setLobby,
  getCurrentTeam,
  setCurrentTeam,
  startGame,
  ImAdmin,
  joinLobby,
  kickLobby,
  mutePlayer,
  unmutePlayer,
  banPlayer,
  unbanPlayer,
  disbandTeam,
  handleGameClosed,
  getLocalHistoryGame,
  setLocalHistoryGame,
  setLocalHistoryTeams,
  getLocalHistoryTeams,
  getHistoryGames,
};

async function getHistoryGames(listIds) {
  debugger;
  let snapshot = await fireStore
    .collection("lobbies")
    .where(firebase.firestore.FieldPath.documentId(), "in", listIds)
    .get();
  let z = snapshot.docs.map((doc) => {
    return { ...doc.data(), lobbyId: doc.id };
  });
  return z;
}
function handleGameClosed(lobbyId, game, teams) {
  debugger;
  window.localStorage.removeItem("activeGame");
  window.localStorage.removeItem("currentlobby");
  window.localStorage.removeItem("game");
  window.localStorage["historyGame"] = JSON.stringify(game);
  window.localStorage["historyTeams"] = JSON.stringify(teams);
}
function getLocalHistoryGame() {
  return JSON.parse(window.localStorage["historyGame"]);
}

function setLocalHistoryGame(game) {
  if (game) window.localStorage["historyGame"] = JSON.stringify(game);
  else {
    window.localStorage.removeItem("historyGame");
  }
}

function setLocalHistoryTeams(teams) {
  if (teams) window.localStorage["historyTeams"] = JSON.stringify(teams);
  else {
    window.localStorage.removeItem("historyTeams");
  }
}
function getLocalHistoryTeams() {
  return JSON.parse(window.localStorage["historyTeams"]);
}

function disbandTeam(lobbyId, team) {
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .collection("teams")
    .doc(team)
    .delete();
}

function unbanPlayer(player, lobbyId) {
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .update({
      banned: firebase.firestore.FieldValue.arrayRemove(player),
    });
}

function banPlayer(player, lobbyId) {
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .update({
      banned: firebase.firestore.FieldValue.arrayUnion(player),
    });
}

function unmutePlayer(player, lobbyId) {
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .update({
      muted: firebase.firestore.FieldValue.arrayRemove(player),
    });
}

function mutePlayer(player, lobbyId) {
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .update({
      muted: firebase.firestore.FieldValue.arrayUnion(player),
    });
}

function joinLobby(lobby) {
  return fireStore
    .collection("lobbies")
    .doc(lobby)
    .update({
      players: firebase.firestore.FieldValue.arrayUnion(
        UserService.getCurrentPlayer().name
      ),
    });
}

function ImAdmin(lobby) {
  debugger;
  if (!lobby) return undefined;
  return UserService.getCurrentPlayer().name === lobby.owner;
}

function startGame(lobbyId, game) {
  fireStore.collection("lobbies").doc(lobbyId).set(
    {
      startTime: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  game.players.forEach((element) => {
    fireStore.collection("users").doc(element).set(
      {
        activeGame: lobbyId,
        dateActiveGame: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  // debugger;
  // axios({
  //   headers: {
  //     "Access-Control-Allow-Origin": "*",
  //   },
  //   method: "post",
  //   url: "https://us-central1-projecthunt-2644e.cloudfunctions.net/helloWorld",
  //   data: {
  //     lobbyId,
  //     game,
  //   },
  // });
}

function getCurrentTeam() {
  return window.localStorage["joinedTeam"];
}
function setCurrentTeam(team) {
  return (window.localStorage["joinedTeam"] = team);
}

function addTeam(lobby, team, player, noPlayers = false) {
  !noPlayers
    ? fireStore
        .collection("lobbies")
        .doc(lobby)
        .collection("teams")
        .doc(team)
        .set({
          players: [player],
        })
    : fireStore
        .collection("lobbies")
        .doc(lobby)
        .collection("teams")
        .doc(team)
        .set({
          players: [],
        });
}
function leaveTeam(lobbyId, teamName, playerName, players) {
  debugger;
  window.localStorage.removeItem("joinedTeam");
  return players === 1
    ? fireStore
        .collection("lobbies")
        .doc(lobbyId)
        .collection("teams")
        .doc(teamName)
        .delete()
    : fireStore
        .collection("lobbies")
        .doc(lobbyId)
        .collection("teams")
        .doc(teamName)
        .update({
          players: firebase.firestore.FieldValue.arrayRemove(playerName),
        });
}
function playerJoinTeam(lobby, team, playerName) {
  window.localStorage["joinedTeam"] = team;
  return fireStore
    .collection("lobbies")
    .doc(lobby)
    .collection("teams")
    .doc(team)
    .update({
      players: firebase.firestore.FieldValue.arrayUnion(playerName),
    });
}
function leaveLobby(username, team) {
  debugger;
  let res = kickLobby(username, team);
  res.then(() => {
    window.localStorage.removeItem("currentLobby");
    window.localStorage.removeItem("joinedTeam");
  });
  return res;
}
function kickLobby(username, team) {
  try {
    fireStore
      .collection("lobbies")
      .doc(LobbyService.getCurrentLobby())
      .collection("teams")
      .doc(team)
      .update({
        players: firebase.firestore.FieldValue.arrayRemove(username),
      });
  } finally {
    return fireStore
      .collection("lobbies")
      .doc(LobbyService.getCurrentLobby())
      .update({
        players: firebase.firestore.FieldValue.arrayRemove(username),
      });
  }
}

function postLobby(game) {
  var lobbyRef = fireStore.collection("lobbies");
  return lobbyRef.add({ ...game, lobbyCreatedDate: Date.now() });
}
function getCurrentLobby() {
  return window.localStorage["currentLobby"];
}
async function getLobby(lobbyId) {
  let lobbyRef = fireStore.collection("lobbies").doc(lobbyId);
  return lobbyRef.get().then((x) => {
    return { ...x.data(), id: x.id };
  });
}

function getTeams(lobbyId) {
  let teams = [];
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .collection("teams")
    .get()
    .then((querySnapsgot) => {
      querySnapsgot.forEach((doc) => {
        teams.push({ ...doc.data(), name: doc.id });
      });
    })
    .then(() => {
      return teams;
    });
}
function deleteLobby(id) {
  var lobbyRef = fireStore.collection("lobbies").doc(id);
  lobbyRef.delete();
}

async function getLobbies(password) {
  const snapshot = await fireStore
    .collection("lobbies")
    .where("password", "==", password)
    .get();
  let z = snapshot.docs.map((doc) => {
    return { ...doc.data(), lobbyId: doc.id };
  });
  return z.filter((x) => !x.startTime);
}

function setLobby(lobbyId) {
  window.localStorage["currentLobby"] = lobbyId;
}
