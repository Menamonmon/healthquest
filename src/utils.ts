import cronParser, { CronDate } from "cron-parser";
import { Day } from "./types";
import { Timestamp } from "@firebase/firestore";

export const toTimestamp = (date: Date) => {
  return Timestamp.fromDate(date);
};

export const toTimestamps = (dates: Date[]) => {
  return dates.map((d) => Timestamp.fromDate(d));
};

export interface EnumObject {
  [enumValue: number]: string;
}

export const getEnumValues = (e: EnumObject): string[] => {
  const values = Object.keys(e).map((i) => e[parseInt(i)]);
  return values.filter((v) => v !== undefined);
};

export const timeStringToDate = (timestr: string): Date => {
  const d = new Date(0);
  const [hours, minutes] = timestr.split(":");
  d.setHours(parseInt(hours));
  d.setMinutes(parseInt(minutes));
  return d;
};

export const dateStringToDate = (dateStr: string): Date => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

export const createCron = (days: Day[], times: string[]) => {
  const hours = new Set();
  const minutes = new Set();
  for (const time of times) {
    const [myhours, myminutes] = time.split(":");
    hours.add(parseInt(myhours));
    minutes.add(parseInt(myminutes));
  }
  const cron = `${Array.from(minutes.values()).join(",")} ${Array.from(
    hours.values()
  ).join(",")} * * ${days.join(",")}`;
  return cron;
};

export const getNextAlarmTime = (
  cron: string,
  times: string[],
  start_date: Date,
  end_date: Date
): Date | undefined => {
  const meets = (cronDate: CronDate, times: string[]): boolean => {
    const options: Intl.DateTimeFormatOptions = {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    };
    const time = Intl.DateTimeFormat("us", options).format(cronDate.getTime());
    return times.includes(time);
  };
  const interval = cronParser.parseExpression(cron, {
    endDate: end_date,
    startDate: start_date,
  });
  let nextDate;
  try {
    nextDate = interval.next();
  } catch (err) {
    return undefined;
  }
  while (!meets(nextDate, times)) {
    try {
      nextDate = interval.next();
    } catch (err) {
      return new Date(0);
    }
  }
  return new Date(nextDate.toString());
};

export const isDateStringValid = (dateString: string): boolean => {
  const d = dateStringToDate(dateString);
  return !isNaN(d.getTime());
};

export const getParamFromUrl = (paramName: string): string => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const result = urlParams.get(paramName);
  return result ? result : "";
};
