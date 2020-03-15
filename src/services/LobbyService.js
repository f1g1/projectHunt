import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from 'firebase';

export const VISIBILITY = {
    public: "public",
    code: "code"
}

export const LobbyService = {
    postLobby: postLobby,
    getLobbies,
    deleteLobby,
    getLobby,
    getCurrentLobby,
    leaveLobby,
    playerJoinTeam,
    parseTeams,
    leaveTeam,
    addTeam,
    getTeams,
    joinLobby,
};




function addTeam(lobby, team, player) {
    debugger;
    // fireStore
    //     .collection("lobbies")
    //     .doc(lobby)
    //     .collection("teams")
    //     .doc(team)
    //     .update({
    //         players: firebase.firestore.FieldValue.arrayUnion(player)
    //     })
    fireStore
        .collection("lobbies")
        .doc(lobby)
        .collection("teams")
        .doc(team)
        .set({
            players: [player]

        })
}
function leaveTeam(lobbyId, playerName, teamName, stateTeams) {
    fireStore
        .collection("lobbies")
        .doc(lobbyId)
        .collection("teams")
        .doc(teamName)
        .update({
            "players": firebase.firestore.FieldValue.arrayRemove(playerName)
        })
        .then(x => console.log(x))
    console.log(stateTeams);
    return stateTeams
}

function parseTeams(lobby) {
    // let teams = [];
    // lobby.players.forEach(element => {
    //     if (element.team)
    //         if (teams.filter(x => x === element.team.lenght === 0))
    //             teams[element.team] = [element];
    //         else teams[element.team].push(element);
    // });
    // return teams;

}


function playerJoinTeam(lobby, team, playerName) {
    fireStore
        .collection("lobbies")
        .doc(lobby)
        .collection("teams")
        .doc(team)
        .update({
            players: firebase.firestore.FieldValue.arrayUnion(playerName)
        });

}

function leaveLobby() {
    window.localStorage.removeItem("currentLobby");

}
function postLobby(game) {
    var lobbyRef = fireStore
        .collection("lobbies")
    return lobbyRef.add({ ...game, lobbyCreatedDate: Date.now() })
}
function getCurrentLobby() {
    return window.localStorage["currentLobby"]
}
async function getLobby(lobbyId) {
    let lobbyRef = fireStore
        .collection("lobbies")
        .doc(lobbyId)
    return lobbyRef.get().then(x => { return x.data() });
}

function getTeams(lobbyId) {
    let teams = [];
    return fireStore
        .collection("lobbies")
        .doc(lobbyId)
        .collection("teams")
        .get()
        .then(querySnapsgot => {
            querySnapsgot.forEach(doc => {
                teams.push({ ...doc.data(), name: doc.id })
            })
        })
        .then(() => { return teams })

}


function deleteLobby(id) {
    var lobbyRef = fireStore
        .collection("lobbies")
        .doc(id)
    lobbyRef.delete();
}

async function getLobbies() {
    const snapshot = await fireStore
        .collection("lobbies").get();
    return snapshot.docs.map(doc => {
        return { ...doc.data(), lobbyId: doc.id }
    });
}

function joinLobby(player, lobby) {
    window.localStorage["currentLobby"] = lobby;
}