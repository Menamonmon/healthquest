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
  days: Day[];
  description: string;
  end_date: Timestamp;
  start_date: Timestamp;
  name: string;
  owner: string;
  point_value: number;
  times: string[];
  type: ReminderType;
};

export type { NavRoute };
