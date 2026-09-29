import { auth, db, configured } from "./firebase.js";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendEmailVerification, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export function watchAuth(callback) {
  if (!configured) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

export async function registerUser({name,email,password,phone}) {
  if (!configured) throw new Error("Firebase is not configured yet.");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid, name, email, phone: phone || "",
    role: "user", emailVerified: false, createdAt: serverTimestamp()
  });
  await sendEmailVerification(cred.user);
  return cred.user;
}

export async function loginUser(email,password) {
  if (!configured) throw new Error("Firebase is not configured yet.");
  const cred = await signInWithEmailAndPassword(auth,email,password);
  return cred.user;
}

export async function resendVerification() {
  if (!configured || !auth?.currentUser) throw new Error("Please sign in first.");
  await sendEmailVerification(auth.currentUser);
}

export async function logoutUser() {
  if (configured) await signOut(auth);
}
