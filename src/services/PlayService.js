import { LobbyService } from "./LobbyService";
import MediaService from "./MediaService";
import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from "firebase";
import moment from "moment";

// const axios = require('axios').default;

export const PlayService = {
  setGame,
  getGame,
  submitAnswer,
  getActiveSteps,
  getCompletedSteps: getInactiveSteps,
  setTimeOut,
  getTimeOut,
  deleteTimeOut,
  getAdjustmentPoints,
  getTotalPoints,
  getChallengesPoints,
  submitAnswerImage,
  shareLocation,
  saveArea,
  saveAdminPoint,
  getAllActiveSteps,
};

function saveAdminPoint(point) {
  return fireStore
    .collection("lobbies")
    .doc(LobbyService.getCurrentLobby())
    .set({ adminPoint: point }, { merge: true });
}

function saveArea(area) {
  return fireStore
    .collection("lobbies")
    .doc(LobbyService.getCurrentLobby())
    .set({ area: area }, { merge: true });
}

function shareLocation(location, team) {
  debugger;
  return fireStore
    .collection("lobbies")
    .doc(LobbyService.getCurrentLobby())
    .collection("teams")
    .doc(team)
    .update({
      location: firebase.firestore.FieldValue.arrayUnion({
        lat: location.latitude,
        lng: location.longitude,
        time: Date.now(),
      }),
    });
}

function submitAnswerImage(image, step, team, finished) {
  MediaService.SaveImage(image).then((x) => {
    !step.needsValidation
      ? fireStore
          .collection("lobbies")
          .doc(LobbyService.getCurrentLobby())
          .collection("teams")
          .doc(team)
          .update({
            completed: firebase.firestore.FieldValue.arrayUnion(step.id),
            [step.id]: {
              imageAnswer: x,
              time: firebase.firestore.FieldValue.serverTimestamp(),
              submitedBy: UserService.getCurrentPlayer().name,
            },
            finished,
          })
      : fireStore
          .collection("lobbies")
          .doc(LobbyService.getCurrentLobby())
          .collection("teams")
          .doc(team)
          .update({
            toBeValidated: firebase.firestore.FieldValue.arrayUnion(step.id),
            [step.id]: {
              imageAnswer: x,
              time: firebase.firestore.FieldValue.serverTimestamp(),
              submitedBy: UserService.getCurrentPlayer().name,
            },
          });
  });
}

function getAdjustmentPoints(team) {
  if (team.adjustments)
    return team.adjustments.reduce((x, y) => (x += parseInt(y.value)), 0);
  return 0;
}

function getChallengesPoints(team, game) {
  let completed = getCompletedSteps(game, team.name, [team]);
  return completed.reduce((t, x) => (t += parseInt(x.points)), 0);
}
function getTotalPoints(team, game) {
  return getAdjustmentPoints(team) + getChallengesPoints(team, game);
}

function submitAnswer(answer, step, team, finished) {
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
        submitedBy: UserService.getCurrentPlayer().name,
      },
      finished,
    });
  // return axios.post('https://us-central1-projecthunt-2644e.cloudfunctions.net/helloWorld', {
  //     answer,
  //     step,
  //     team,
  //     finished
  // })
  //     // .then(function (response) {
  //     //     debugger;
  //     //     console.log(response);
  //     // })
  //     .catch(function (error) {
  //         console.log(error);
  //     });
}
function deleteTimeOut(step) {
  window.localStorage.removeItem(step.id + "timeout");
}

function setTimeOut(step, duration) {
  window.localStorage[step.id + "timeout"] = moment(Date.now()).add(
    duration,
    "minutes"
  );
}
function getTimeOut(step) {
  let res =
    window.localStorage[step.id + "timeout"] &&
    moment(window.localStorage[step.id + "timeout"]);
  debugger;
  return res;
}

function getActiveSteps(game, team, teams) {
  let steps = [...game.steps];
  let currentTeam = teams.find((x) => x.name === team);
  if (currentTeam) {
    if (currentTeam.completed)
      steps = steps.filter((x) => !currentTeam.completed.includes(x.id));
    if (currentTeam.toBeValidated)
      steps = steps.filter((x) => !currentTeam.toBeValidated.includes(x.id));
    if (game.inOrder) {
      let x = [steps.sort((x) => x.index).find((x) => !x.hidden)];
      let hiddenStepsEnabled = getAvalaibleHidden(game, currentTeam);
      if (x[0]) return x.concat(hiddenStepsEnabled);
      return hiddenStepsEnabled;
    }
    return steps;
  }
}
function getAvalaibleHidden(game, teamObj) {
  let steps = game.steps.filter((x) => x.hidden);
  steps = steps.filter(
    (x) =>
      !teamObj.location.includes(
        (x) => JSON.stringify(x) === JSON.stringify(x.coords)
      )
  );
  if (teamObj.completed)
    steps = steps.filter((x) => !teamObj.completed.includes(x.id));
  if (teamObj.toBeValidated)
    steps = steps.filter((x) => !teamObj.toBeValidated.includes(x.id));
  return steps;
}

function getAllActiveSteps(game, team, teams) {
  let steps = [...game.steps];
  let currentTeam = teams.find((x) => x.name === team);
  if (currentTeam) {
    if (currentTeam.completed) {
      steps = steps.filter((x) => !currentTeam.completed.includes(x.id));
    }
    if (currentTeam.toBeValidated) {
      steps = steps.filter((x) => !currentTeam.toBeValidated.includes(x.id));
    }
  }
  return steps;
}

function getInactiveSteps(game, team, teams) {
  debugger;
  let steps = game.steps;
  let currentTeam = teams.find((x) => x.name === team);
  if (currentTeam && currentTeam.completed) {
    let res = currentTeam.toBeValidated
      ? steps.filter(
          (x) =>
            currentTeam.completed.includes(x.id) ||
            currentTeam.toBeValidated.includes(x.id)
        )
      : steps.filter((x) => currentTeam.completed.includes(x.id));
    res = res.map((x) => ({ ...x, ...currentTeam[x.id] }));

    return res;
  }

  return [];
}
function getCompletedSteps(game, team, teams) {
  debugger;
  let steps = game.steps;
  let currentTeam = teams.find((x) => x.name === team);
  if (currentTeam && currentTeam.completed) {
    let res = steps.filter((x) => currentTeam.completed.includes(x.id));
    res = res.map((x) => ({ ...x, ...currentTeam[x.id] }));

    return res;
  }
  return [];
}

function setGame(game) {
  window.localStorage["game"] = JSON.stringify(game);
}
function getGame() {
  return JSON.parse(window.localStorage["game"]);
}
