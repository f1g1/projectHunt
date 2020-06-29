import MediaService from "./MediaService";
import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";

export const GameService = {
  getMyGames,
  saveGame,
  deleteGame,
  saveToLocal,
};

function saveToLocal(game) {
  window.localStorage["cratingGame"] = JSON.stringify(game);
}
function getFromLocal() {
  let result;
  try {
    result = JSON.parse(window.localStorage["cratingGame"]);
  } finally {
    return result;
  }
}

function saveGame(state) {
  let objToUpdate = { ...state };
  delete objToUpdate.cloneSteps;
  let stepImage = [];
  let succesAnswerImage = [];
  let wrongAnswerImage = [];
  objToUpdate.steps.forEach((element, i) => {
    stepImage.push(MediaService.SaveImage(element.imageFile));
    succesAnswerImage.push(
      MediaService.SaveImage(element.succesResponseImageFile)
    );
    wrongAnswerImage.push(
      MediaService.SaveImage(element.wrongResponseImageFile)
    );
  });

  return Promise.allSettled(wrongAnswerImage)
    .then((v) => {
      v.forEach((image, i) => {
        if (
          objToUpdate.steps[i].wrongResponseImageFile &&
          objToUpdate.steps[i].wrongResponseImage
        ) {
          delete objToUpdate.steps[i].wrongResponseImageFile;
          delete objToUpdate.steps[i].wrongResponseImage;
        }
        if (image.value) {
          objToUpdate.steps[i].wrongResponseImage = image.value;
        }
      });
    })
    .then(() => {
      Promise.allSettled(succesAnswerImage).then((v) => {
        v.forEach((image, i) => {
          //delete only if a new file is provided
          if (
            objToUpdate.steps[i].succesResponseImageFile &&
            objToUpdate.steps[i].succesResponseImageFile
          ) {
            delete objToUpdate.steps[i].succesResponseImageFile;
            delete objToUpdate.steps[i].succesResponseImage;
          }
          if (image.value) {
            objToUpdate.steps[i].succesResponseImage = image.value;
          }
        });
      });
    })
    .then(() => {
      Promise.allSettled(stepImage).then((v) => {
        v.forEach((image, i) => {
          if (objToUpdate.steps[i].imageFile && objToUpdate.steps[i].image) {
            delete objToUpdate.steps[i].imageFile;
            delete objToUpdate.steps[i].image;
          }
          if (image.value) {
            objToUpdate.steps[i].image = image.value;
          }
        });
        MediaService.SaveImage(state.imageFile).then((x) => {
          if (x) objToUpdate.image = x;
          delete objToUpdate.imageFile;
          saveGameInternal(objToUpdate);
        });
      });
    });
}

async function deleteGame(id) {
  return fireStore
    .collection("users")
    .doc(UserService.getCurrentUser().userName)
    .collection("createdGames")
    .doc(id)
    .delete();
}
async function getMyGames() {
  let x = UserService.getCurrentUser();
  var createdGamesRef = fireStore
    .collection("users")
    .doc(UserService.getCurrentUser().userName)
    .collection("createdGames");
  const snapshot = await createdGamesRef.orderBy("createdDate").get();
  return snapshot.docs.map((doc) => {
    return { ...doc.data(), gameId: doc.id };
  });
}

function setIndexesTosteps(steps) {
  steps.forEach((x, i) => (steps[i].index = i));
}

function saveGameInternal(state) {
  setIndexesTosteps(state.steps);

  let created = {
    ...state,
    createdDate: Date.now(),
    owner: UserService.getCurrentUser().userName,
  };
  !created.image && delete created.image;

  let createdGamesRef;
  createdGamesRef = fireStore
    .collection("users")
    .doc(UserService.getCurrentUser().userName)
    .collection("createdGames");
  if (state.gameId) {
    return createdGamesRef.doc(state.gameId).update(state);
  }

  return createdGamesRef.add(created);
}
