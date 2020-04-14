import { fireStore } from "../firebase";

export const UserService = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser,
  getCurrentPlayer,
  checkNewUser,
  SaveNewUser,
  logout,
  getUserFirebase,
  checkUserName
};

function checkUserName(username) {
  return fireStore.collection("users").where("lowerUserName", "==", username.toLowerCase()).get();
}

function logout() {
  window.localStorage.clear("user");
}
function getUserFirebase(email) {
  return fireStore.collection("users").doc(email).get()
}
function SaveNewUser(user) {
  window.localStorage["user"] = JSON.stringify({
    ...user
  });
  return fireStore
    .collection("users")
    .doc(user.email)
    .set(user)
}

function getCurrentUser() {
  return JSON.parse(window.localStorage["user"]) || {};
}

function checkNewUser(user) {
  let ref = fireStore
    .collection("users")
    .doc(user.email)

  return ref.get().then(x => {
    debugger;
    if (x.exists && x.data().username) {
      return false;
    }
    return true;
  }

  )
}
function getCurrentPlayer() {
  let user;
  try {
    user = { ...JSON.parse(window.localStorage["user"]) }
  }
  catch { user = {} };
  return { name: user.userName, image: user.imageUrl }
}
function setCurrentUser(user) {
  window.localStorage["user"] = JSON.stringify({
    ...user
  });
}
