const functions = require('firebase-functions');

var firebase = require("firebase-admin");


var serviceAccount = require("./r-spirit-firebase-adminsdk-8e9gs-4de72c9119.json");

firebase.initializeApp(functions.config().firebase);
/*
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://r-spirit.firebaseio.com"
});
*/


/*
firebase.initializeApp({
  serviceAccount: {
    projectId: "r-spirit",
    clientEmail: "candlf@r-spirit.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\n5c10eed887f3943d22b1a3460f0fee7a919d8372\n-----END PRIVATE KEY-----\n"
  },
  databaseURL: "https://r-spirit.firebaseio.com"
});
*/
console.log("aaa");
var db = firebase.database();
var ref = db.ref("users");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});