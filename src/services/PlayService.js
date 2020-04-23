import { LobbyService } from "./LobbyService";
import MediaService from "./MediaService";
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
    getChallengesPoints,
    submitAnswerImage
}

function submitAnswerImage(image, step, team) {
    debugger;
    MediaService.SaveImage(image).then(x => {
        debugger;
        !step.needsValidation ?
            fireStore
                .collection("lobbies")
                .doc(LobbyService.getCurrentLobby())
                .collection("teams")
                .doc(team)
                .update({
                    completed: firebase.firestore.FieldValue.arrayUnion(step.id),
                    [step.id]: {
                        image: x,
                        time: firebase.firestore.FieldValue.serverTimestamp(),
                        submitedBy: UserService.getCurrentPlayer().name
                    }
                }) : fireStore
                    .collection("lobbies")
                    .doc(LobbyService.getCurrentLobby())
                    .collection("teams")
                    .doc(team)
                    .update({
                        toBeValidated: firebase.firestore.FieldValue.arrayUnion(step.id),
                        [step.id]: {
                            image: x,
                            time: firebase.firestore.FieldValue.serverTimestamp(),
                            submitedBy: UserService.getCurrentPlayer().name
                        }
                    })

    })
}

function getAdjustmentPoints(team) {
    if (team.adjustments)
        return team.adjustments.reduce((x, y) => x += parseInt(y.value), 0);
    return 0
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
    let currentTeam = teams.find(x => x.name === team);
    if (currentTeam && currentTeam.completed) {
        let z = steps.filter(x => !currentTeam.completed.includes(x.id) && !currentTeam.toBeValidated.includes(x.id));
        debugger;
        return z;
    }
    return steps;
}
function getCompletedSteps(game, team, teams) {
    let steps = game.steps;
    debugger;
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