const functions = require("firebase-functions");
const admin = require("firebase-admin");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
const firestore = admin.firestore();
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
