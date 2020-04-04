import { fireStore } from "../firebase";

export const UserService = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser,
  getCurrentPlayer,
  checkNewUser,
  SaveNewUser,
  logout
};

function logout() {
  window.localStorage.clear("user");
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
    if (!x.exists || !x.username) {
      return false;
    }
    return true;
  }

  )
}
function getCurrentPlayer() {
  let user = JSON.parse(window.localStorage["user"]) || {};
  return { name: user.userName, image: user.imageUrl }
}
function setCurrentUser(user) {
  window.localStorage["user"] = JSON.stringify({
    ...user
  });
}
