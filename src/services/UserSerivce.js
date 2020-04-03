import { fireStore } from "../firebase";

export const UserService = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser,
  getCurrentPlayer,
  checkNewUser
};

function getCurrentUser() {
  return JSON.parse(window.localStorage["user"]) || {};
}

let checkNewUser = (user) => {
  let ref = fireStore
    .collection("users")
    .doc(user.email)

  ref.get().then(x => {
    if (!x.exists || !x.username) {
      return true;
    }
    return false;
  }

  )
}
function getCurrentPlayer() {
  let user = JSON.parse(window.localStorage["user"]) || {};
  return { name: user.familyName + " " + user.givenName, image: user.imageUrl }
}
function setCurrentUser(user) {
  window.localStorage["user"] = JSON.stringify({
    ...user
  });
}
