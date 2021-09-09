// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {
  collection,
  getFirestore,
  where,
  query,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { Reminder } from "../types";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const signInWithGoogle = async () => {
  try {
    const googleAuthProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getMyReminders: () => Promise<Reminder[]> = async () => {
  const remindersRef = collection(db, "reminders");
  const q = query(remindersRef, where("owner", "==", auth?.currentUser?.uid));
  const querySnapshot = await getDocs(q);
  const docsData = querySnapshot.docs.map((doc) => doc.data());
  return docsData as Reminder[];
};

const addReminder: (reminder: Omit<Reminder, "owner">) => Promise<boolean> =
  async (reminder) => {
    if (!auth.currentUser) {
      return false;
    }
    const remindersRef = collection(db, "reminders");
    const newReminder: Reminder = {
      ...reminder,
      owner: auth?.currentUser?.uid,
    };
    try {
      await addDoc(remindersRef, newReminder);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

export { auth, signInWithGoogle, getMyReminders, addReminder };
