import { Timestamp } from "@firebase/firestore";

type NavRoute = {
  component: React.FC<any>;
  path: string;
  _protected?: boolean;
  unprotected?: boolean;
  pageTitle: string;
  redirect: string;
  onDrawer?: boolean;
};

export enum Day {
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
}

export type ReminderType = "MEDICINE" | "EXERCISE" | "METRICS" | "OTHER";

export type Reminder = {
  id?: string;
  days: Day[];
  description: string;
  end_date: Timestamp;
  start_date: Timestamp;
  name: string;
  owner: string;
  point_value: number;
  times: string[];
  type: ReminderType;
  nextAlarm?: Date;
};

export type { NavRoute };

export type UserType = "PATIENT" | "DOCTOR";

export type UserProfile = {
  points: number;
  user_type: UserType;
  uid: string;
};

export type ChatConversation = {
  id: string;
  participants: string[];
  created_at: Timestamp;
};

export type ChatConversationParticipantInfo = {
  displayName: string;
  photoURL: string;
};

export type ChatConversationInfo = ChatConversation & {
  otherUser: ChatConversationParticipantInfo;
};

export type ChatMessageType = {
  sender: ChatConversationParticipantInfo & { uid: string };
  created_at: Timestamp;
  content: string;
  conv_id: string;
  id: string;
};
