// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {
  collection,
  getFirestore,
  where,
  query,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { Reminder, UserProfile } from "../types";
import { createCron, getNextAlarmTime } from "../utils";

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

export const signInWithGoogle = async () => {
  try {
    const googleAuthProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getMyReminders: () => Promise<Reminder[]> = async () => {
  const remindersRef = collection(db, "reminders");
  const q = query(remindersRef, where("owner", "==", auth?.currentUser?.uid));
  const querySnapshot = await getDocs(q);
  const docsData = querySnapshot.docs.map((doc) => {
    const document = doc.data();
    document.id = doc.id;
    return document;
  });
  return docsData as Reminder[];
};

export const getLatestReminders: (limit: number) => Promise<Reminder[]> =
  async (limit) => {
    const remindersRef = collection(db, "reminders");
    const q = query(remindersRef, where("owner", "==", auth?.currentUser?.uid));
    const querySnapshot = await getDocs(q);
    const docsData = querySnapshot.docs.map((doc) => {
      const document = doc.data();
      document.id = doc.id;
      return document;
    });
    const remindersList = docsData as Reminder[];

    // sorting reminders by next alarm values
    const sortedReminders = remindersList
      .map((r) => {
        const { days, times, start_date, end_date } = r;
        const cron = createCron(days, times);
        r.nextAlarm = getNextAlarmTime(
          cron,
          times,
          start_date.toDate(),
          end_date.toDate()
        );
        return r;
      })
      .sort((a, b) =>
        a.nextAlarm && b.nextAlarm
          ? new Date(a.nextAlarm).getTime() - new Date(b.nextAlarm).getTime()
          : 0
      );

    const final =
      limit > sortedReminders.length
        ? sortedReminders
        : sortedReminders.slice(0, limit);
    return final;
  };

export const addReminder: (
  reminder: Omit<Reminder, "owner">
) => Promise<boolean> = async (reminder) => {
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

export const updateReminder = async (
  reminderId: string,
  reminder: Omit<Reminder, "owner">
) => {
  if (!auth.currentUser) {
    return false;
  }
  const reminderRef = doc(db, "reminders", reminderId);
  try {
    await setDoc(reminderRef, { ...reminder, owner: auth?.currentUser?.uid });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getReminder = async (
  reminderId: string
): Promise<Reminder | null> => {
  const reminderRef = doc(db, "reminders", reminderId);
  try {
    const doc = await getDoc(reminderRef);
    const data = doc.data();
    return data as Reminder;
  } catch (err) {
    return null;
  }
};

export const deleteReminder = async (reminderId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, "reminders", reminderId));
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userProfDoc = await getDoc(doc(db, "user_profiles", uid));
    const userProfile = userProfDoc.data() as UserProfile;
    return userProfile;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export { auth };
