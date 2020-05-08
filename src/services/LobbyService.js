import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from "firebase";

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
  mutePlayer,
  unmutePlayer,
  banPlayer,
  unbanPlayer,
  disbandTeam,
};

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
  return lobby && UserService.getCurrentPlayer().name === lobby.owner;
}

function startGame(lobbyId) {
  fireStore.collection("lobbies").doc(lobbyId).set(
    {
      startTime: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
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
function leaveLobby(username) {
  debugger;
  let res;
  if (getCurrentTeam())
    res = fireStore
      .collection("lobbies")
      .doc(LobbyService.getCurrentLobby())
      .collection("teams")
      .doc(window.localStorage["joinedTeam"])
      .update({
        players: firebase.firestore.FieldValue.arrayRemove(username),
      })
      .then(() => {
        window.localStorage.removeItem("currentLobby");
        window.localStorage.removeItem("joinedTeam");
      });
  return fireStore
    .collection("lobbies")
    .doc(LobbyService.getCurrentLobby())
    .update({
      players: firebase.firestore.FieldValue.arrayRemove(username),
    });
  return res;
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
  return snapshot.docs.map((doc) => {
    return { ...doc.data(), lobbyId: doc.id };
  });
}

function setLobby(lobbyId) {
  window.localStorage["currentLobby"] = lobbyId;
}
