import { LobbyService } from "./LobbyService";
import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from 'firebase';

export const PlayService = {
    setGame,
    getGame,
    submitAnswer,
    getActiveSteps,
    getCompletedSteps
}

function submitAnswer(answer, step, team) {
    debugger;
    return fireStore
        .collection("lobbies")
        .doc(LobbyService.getCurrentLobby())
        .collection("teams")
        .doc(team)
        .update({
            completed: firebase.firestore.FieldValue.arrayUnion(step.id),
            [step.id]: {
                answer,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                submitedBy: UserService.getCurrentPlayer().name
            }
        });

}

function getActiveSteps(game, team, teams) {
    let steps = game.steps;
    debugger
    let currentTeam = teams.find(x => x.name === team);
    if (currentTeam && currentTeam.completed)
        return steps.filter(x => !currentTeam.completed.includes(x.id));
    return steps;
}
function getCompletedSteps(game, team, teams) {
    let steps = game.steps;
    debugger
    let currentTeam = teams.find(x => x.name === team);
    if (currentTeam && currentTeam.completed) {
        let res = steps.filter(x => currentTeam.completed.includes(x.id));
        debugger;
        return res;
    }
    return steps;
}




function setGame(game) {
    window.localStorage["game"] = JSON.stringify(game)
}
function getGame() {
    return JSON.parse(window.localStorage["game"]);
}