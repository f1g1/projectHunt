import { fireStore } from "../firebase";

export const UserService = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser,
  getCurrentPlayer,
  checkNewUser,
  SaveNewUser,
  logout,
  getUserFirebase,
  checkUserName,
};

function checkUserName(username) {
  return fireStore
    .collection("users")
    .where("lowerUserName", "==", username.toLowerCase())
    .get();
}

function logout() {
  window.localStorage.removeItem("user");
}
function getUserFirebase(email) {
  return fireStore.collection("users").where("email", "==", email).get();
}
function SaveNewUser(user) {
  if (user)
    window.localStorage["user"] = JSON.stringify({
      ...user,
    });
  return fireStore.collection("users").doc(user.userName).set(user);
}

function getCurrentUser() {
  let x;
  try {
    x = JSON.parse(window.localStorage["user"]);
  } catch {}
  debugger;
  if (x && x.name) return x;
  else return undefined;
}

function checkNewUser(user) {
  let ref = fireStore.collection("users").doc(user.userName);

  return ref.get().then((x) => {
    if (x.exists && x.data().username) {
      return false;
    }
    return true;
  });
}
function getCurrentPlayer() {
  let user;
  try {
    user = { ...JSON.parse(window.localStorage["user"]) };
  } catch {
    user = {};
  }
  return { name: user.userName, image: user.imageUrl };
}
function setCurrentUser(user) {
  debugger;
  if (user)
    window.localStorage["user"] = JSON.stringify({
      ...user,
    });
}
