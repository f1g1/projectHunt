import { UserService } from "./UserSerivce";
import { fireStore } from "../firebase";

export const GamesService = {
  getMyGames: getMyGames,
  saveGame: saveGame
};
async function getMyGames() {
  var createdGamesRef = fireStore
    .collection("users")
    .doc(UserService.getCurrentUser().email)
    .collection("createdGames");
  const snapshot = await createdGamesRef.orderBy("createdDate").get();
  return snapshot.docs.map(doc => {
    return { ...doc.data(), id: doc.id };
  });
}
function saveGame(state) {
  let created = {
    ...state,
    createdDate: Date.now(),
    owner: UserService.getCurrentUser().email
  };
  var createdGamesRef = fireStore
    .collection("users")
    .doc(UserService.getCurrentUser().email)
    .collection("createdGames");
  return createdGamesRef.add(created);
}
