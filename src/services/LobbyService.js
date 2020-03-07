import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";


export const VISIBILITY = {
    public: "public",
    code: "code"
}

export const LobbyService = {
    postLobby: postLobby,
    getLobbies,
    deleteLobby,
    joinLobby,
    getLobby
};

function postLobby(game) {
    var lobbyRef = fireStore
        .collection("lobbies")
    return lobbyRef.add({ ...game, lobbyCreatedDate: Date.now() })
}
function getLobby(lobbyId) {
    var lobbyRef = fireStore
        .collection("lobbies")
        .doc(lobbyId)
    return lobbyRef.get().then(x => x.data());
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
    var playersRef = fireStore
        .collection("lobbies")
        .doc(lobby)
        .collection("players")
    return playersRef.where("name", "==", player.name).get()
        .then(x => {
            if (x.size == 0)
                playersRef.doc(player.name).set(player)
        })
}