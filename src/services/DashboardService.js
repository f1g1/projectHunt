import { LobbyService } from "./LobbyService";
import { PlayService } from "./PlayService";
import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";
import firebase from "firebase";

var moment = require("moment");

export const DashboardService = {
  revokeChallenge,
  completeChallenge,
  adjustPoints,
  deleteAdjustment,
  getToBeValidated,
  approveAnswer,
  revokeAnswer,
  closeGame,
  addStep,
};

function addStep(lobbyId, step) {
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .update({
      steps: firebase.firestore.FieldValue.arrayUnion(step),
    });
}

function closeGame(lobbyId, game, teams) {
  let finalLeaderboard = teams.map((x) => {
    return {
      points: PlayService.getTotalPoints(x, game),
      name: x.name,
      players: x.players,
      lastTime:
        x.completed && x.completed.length > 0
          ? moment(
              x[x.completed[x.completed.length - 1]].time.seconds * 1000
            ).format("DD/MM HH:mm")
          : "N/A",
    };
  });
  return fireStore
    .collection("lobbies")
    .doc(lobbyId)
    .set(
      {
        finishTime: firebase.firestore.FieldValue.serverTimestamp(),
        finalLeaderboard,
      },
      { merge: true }
    )
    .then(
      game.players.forEach((element) => {
        fireStore
          .collection("users")
          .doc(element)
          .set(
            {
              activeGame: null,
              dateActiveGame: null,
              history: firebase.firestore.FieldValue.arrayUnion({
                lobbyId: lobbyId,
                title: game.title,
                image: game.image || null,
                date: game.startTime,
              }),
            },
            { merge: true }
          );
      })
    );
}

function revokeAnswer(id, team) {
  return fireStore
    .collection("lobbies")
    .doc(LobbyService.getCurrentLobby())
    .collection("teams")
    .doc(team)
    .update({
      toBeValidated: firebase.firestore.FieldValue.arrayRemove(id),
      [id]: null,
    });
}

function approveAnswer(id, team, finished) {
  return fireStore
    .collection("lobbies")
    .doc(LobbyService.getCurrentLobby())
    .collection("teams")
    .doc(team)
    .update({
      toBeValidated: firebase.firestore.FieldValue.arrayRemove(id),
      completed: firebase.firestore.FieldValue.arrayUnion(id),
      finished,
    });
}

function getToBeValidated(teams, steps) {
  let needsValidation = [];
  teams.forEach((element) => {
    element.toBeValidated &&
      element.toBeValidated.forEach((x) => {
        let step = steps.find((z) => z.id === x);
        needsValidation.push({
          ...x,
          ...step,
          name: element.name,
          ...element[x],
        });
      });
  });
  return needsValidation.sort((x) => x.time.seconds);
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
      failed: firebase.firestore.FieldValue.arrayRemove(step.id),
      [step.id]: null,
      finished: false,
    });
}

function completeChallenge(teamName, step, finished = false) {
  let answer =
    step.answerType !== 2
      ? {
          answer: step.code,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          submitedBy: UserService.getCurrentPlayer().name,
          byAdmin: true,
        }
      : {
          answeImage: null,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          submitedBy: UserService.getCurrentPlayer().name,
          byAdmin: true,
        };

  return fireStore
    .collection("lobbies")
    .doc(LobbyService.getCurrentLobby())
    .collection("teams")
    .doc(teamName)
    .update({
      completed: firebase.firestore.FieldValue.arrayUnion(step.id),
      [step.id]: answer,
      finished,
    });
}
