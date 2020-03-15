export const UserService = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser,
  getCurrentPlayer
};

function getCurrentUser() {
  return JSON.parse(window.localStorage["user"]) || {};
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
