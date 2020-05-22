import { useEffect, useState } from "react";
import { fireStore } from "../../firebase";

export default function useGameChanges(user) {
  const [finalUser, setUser] = useState();
  let unsubscribe;
  useEffect(() => {
    unsubscribe = fireStore
      .collection("users")
      .doc(user)
      .onSnapshot(function (snapshot) {
        setUser(snapshot.data());
      });

    return () => {
      unsubscribe();
    };
  }, []);
  return finalUser;
}
