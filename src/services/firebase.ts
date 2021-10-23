import { ChatConversation, ChatConversationInfo } from "./../types";
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
import {
  ChatConversationParticipantInfo,
  Reminder,
  UserProfile,
} from "../types";
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

export const getChatConversations = async (uid: string) => {
  const conversationsRef = collection(db, "conversations");
  try {
    const convDocs = await getDocs(
      query(conversationsRef, where("participants", "array-contains", uid))
    );
    const data = convDocs.docs.map((doc) => {
      const document = doc.data();
      document.id = doc.id;
      return document;
    }) as ChatConversation[];
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const startConversation = async (
  recepientEmail: string
): Promise<ChatConversation | false> => {
  if (auth.currentUser !== null) {
    const uid = auth.currentUser.uid;
    try {
      const response = await fetch(
        "https://us-central1-cacapp-76367.cloudfunctions.net/startConversation",
        {
          method: "POST",
          body: JSON.stringify({ uid, email: recepientEmail }),
        }
      );
      const data = await response.json();
      return data.conversation as ChatConversation;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  return false;
};

export const getUserInfoById = async (uid: string) => {
  try {
    const response = await fetch(
      "https://us-central1-cacapp-76367.cloudfunctions.net/getUserInfoById",
      {
        method: "POST",
        body: JSON.stringify({ uid: uid }),
      }
    );
    const data = await response.json();
    return data as ChatConversationParticipantInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getChatConversationInfo = async (
  conversationId: string
): Promise<ChatConversationInfo | null> => {
  const convRef = doc(db, "conversations", conversationId);
  try {
    const doc = await getDoc(convRef);
    const data = doc.data();
    if (data) {
      data.id = conversationId;
      const otherUserId = data.participants.filter(
        (uid: string) => uid !== auth.currentUser?.uid
      )[0];
      data.otherUser = await getUserInfoById(otherUserId);
      return data as ChatConversationInfo;
    }
  } catch (err) {
    return null;
  }
  return null;
};

export { auth };
