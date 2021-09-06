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

export type Day = "M" | "TU" | "W" | "TH" | "F" | "SA" | "SU";

export type ReminderType = "MEDICINE" | "EXERCISE" | "METRICS" | "OTHER";

export type Reminder = {
  days: Day[];
  description: string;
  end_date: Timestamp;
  start_date: Timestamp;
  name: string;
  owner: string;
  point_value: number;
  times: Date[];
  type: ReminderType;
};

export type { NavRoute };
