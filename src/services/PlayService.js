import { LobbyService } from "./LobbyService";
import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from 'firebase';
import moment from 'moment';

export const PlayService = {
    setGame,
    getGame,
    submitAnswer,
    getActiveSteps,
    getCompletedSteps,
    setTimeOut,
    getTimeOut,
    deleteTimeOut,
    getAdjustmentPoints,
    getTotalPoints,
    getChallengesPoints
}


function getAdjustmentPoints(team) {
    return team.adjustments.reduce((x, y) => x += parseInt(y.value), 0);
}

function getChallengesPoints(team, game) {
    let completed = getCompletedSteps(game, team.name, [team])
    return completed.reduce((t, x) => t += parseInt(x.points), 0)
}
function getTotalPoints(team, game) {
    return getAdjustmentPoints(team) + getChallengesPoints(team, game);
}

function submitAnswer(answer, step, team) {
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
function deleteTimeOut(step) {
    window.localStorage.removeItem(step.id + "timeout");
}

function setTimeOut(step, duration) {
    window.localStorage[step.id + "timeout"] = moment(Date.now()).add(duration, 'minutes');
}
function getTimeOut(step) {
    let res = window.localStorage[step.id + "timeout"] && moment(window.localStorage[step.id + "timeout"]);
    debugger;
    return res;
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
        res = res.map(x => ({ ...x, ...currentTeam[x.id] }))
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