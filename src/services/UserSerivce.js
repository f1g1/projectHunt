export const UserService = {
  getCurrentUser: getCurrentUser,
  setCurrentUser: setCurrentUser
};

function getCurrentUser() {
  return JSON.parse(window.localStorage["user"]) || {};
}
function setCurrentUser(user) {
  window.localStorage["user"] = JSON.stringify({
    ...user
  });
}
