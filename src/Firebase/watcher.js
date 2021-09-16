import { auth, db } from "./Firebase";

export function watchUserChanges(callback) {
  //Unsuscribe del listener
  const unsub = auth.onAuthStateChanged((user) => {
    if (user && !user.isAnonymous) {
      const { uid, email, displayName } = user;

      callback({
        id: uid,
        email,
        displayName,
      });
    } else {
      callback(null);
    }
  });

  return unsub;
}
