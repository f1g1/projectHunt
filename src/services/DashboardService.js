import { LobbyService } from "./LobbyService";
import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from 'firebase';

export const DashboardService = {
    revokeChallenge,
    completeChallenge,
    adjustPoints,
    deleteAdjustment
}
function deleteAdjustment(team, adjustment) {
    return fireStore
        .collection("lobbies")
        .doc(LobbyService.getCurrentLobby())
        .collection("teams")
        .doc(team.name)
        .update({
            adjustments: firebase.firestore.FieldValue.arrayRemove(adjustment),
        });
}

function adjustPoints(team, adjustment) {
    return fireStore
        .collection("lobbies")
        .doc(LobbyService.getCurrentLobby())
        .collection("teams")
        .doc(team.name)
        .update({
            adjustments: firebase.firestore.FieldValue.arrayUnion(adjustment),
        });
}

function revokeChallenge(teamName, step) {
    return fireStore
        .collection("lobbies")
        .doc(LobbyService.getCurrentLobby())
        .collection("teams")
        .doc(teamName)
        .update({
            completed: firebase.firestore.FieldValue.arrayRemove(step.id),
            [step.id]: null
        });
}


function completeChallenge(teamName, step) {
    return fireStore
        .collection("lobbies")
        .doc(LobbyService.getCurrentLobby())
        .collection("teams")
        .doc(teamName)
        .update({
            completed: firebase.firestore.FieldValue.arrayUnion(step.id),
            [step.id]: {
                answer: step.code,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                submitedBy: UserService.getCurrentPlayer().name

            }
        });

}