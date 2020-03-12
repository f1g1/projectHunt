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
    addTeam
};

function addTeam(lobby, team, player) {
    fireStore
        .collection("lobbies")
        .doc(lobby)
        .collection("teams")
        .doc("0")
        .set({ [team]: [player] }, { merge: true });
}
function leaveTeam(name, lobby) {
    // fireStore
    //     .collection("lobbies")
    //     .doc(lobby)
    //     .collection("players")
    //     .doc(name).delete();
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
    // fireStore
    //     .collection("lobbies")
    //     .doc(lobby)
    //     .collection("teams")
    //     .doc("0")
    //     .update({
    //         [team]: firebase.firestore.FieldValue.arrayUnion(playerName)
    //     });

}

function leaveLobby() {
    window.localStorage.removeItem("lobbies");

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
    return await lobbyRef.get().then(x => x.data());



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

// function joinLobby(player, lobby) {
//     var playersRef = fireStore
//         .collection("lobbies")
//         .doc(window.localStorage["currentLobby"]+"Players").set(player.name,)


// }