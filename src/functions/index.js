const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cronParser = require("cron-parser");

admin.initializeApp();
const firestore = admin.firestore();

async function getUserEmail(db, uid) {
  try {
    const user = await (await db.collection("users").doc(uid).get()).data();
    if (user) {
      return user.email;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

function isReminderToday(days) {
  const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = WEEKDAYS[new Date().getDay()];
  return days.includes(today);
}

function isWithinNextHour(date) {
  const beginningDate = new Date();
  beginningDate.setMinutes(beginningDate.getMinutes() - 2);
  const nextHourDate = new Date();
  nextHourDate.setHours(nextHourDate.getHours() + 1);
  return (
    new Date().getTime() < date.getTime() &&
    date.getTime() < nextHourDate.getTime()
  );
}

const createCron = (days, times) => {
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

const getNextAlarmTime = (cron, times, start_date, end_date) => {
  const meets = (cronDate, times) => {
    const options = {
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
  let nextDate = interval.next();
  while (!meets(nextDate, times)) {
    try {
      nextDate = interval.next();
    } catch (err) {
      return new Date(0);
    }
  }
  return new Date(nextDate.toString());
};

exports.createNewUserProfile = functions.auth.user().onCreate((user) => {
  const userProfilesRef = firestore.collection("user_profiles");
  const userProfile = {
    points: 0,
    uid: user.uid,
    userType: "PATIENT",
  };
  try {
    userProfilesRef.doc(user.uid).set(userProfile);
  } catch (err) {
    console.log("NOT ABLE TO ADD USER PROFILE");
  }
});
async function schedulerHandler() {
  const remindersRef = firestore.collection("reminders");
  const query = await remindersRef.where("start_date", "<=", new Date()).get();
  query.forEach((doc) => {
    const reminderData = doc.data();
    const {
      start_date,
      end_date,
      days,
      times,
      owner: uid,
      name,
      description,
    } = reminderData;
    if (end_date.toDate().getTime() < new Date().getTime()) {
      return null;
    }
    const reminderToday = isReminderToday(days);
    if (!reminderToday) {
      return null;
    }
    const reminderCronString = createCron(days, times);
    const nextAlarm = getNextAlarmTime(
      reminderCronString,
      times,
      start_date.toDate(),
      end_date.toDate()
    );
    if (!isWithinNextHour(nextAlarm)) {
      return null;
    }
    setTimeout(async () => {
      const email = await getUserEmail(firestore, uid);
      const notification = {
        to: email,
        message: {
          subject: "Reminder for: " + name,
          text: description,
          html: description,
        },
      };
      functions.logger.log("EMAIL QUEDED");
      firestore.collection("mail").add(notification);
    }, nextAlarm.getTime() - new Date().getTime());
  });
}

exports.remindersNotificationsScheduler = functions.pubsub
  .schedule("0 * * * *")
  .onRun(schedulerHandler);
