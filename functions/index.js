const functions = require('firebase-functions');
const textSearch = require('./text-search');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const pushController = require('./pushNotification')

exports.onPostCreated = functions.firestore.document('posts/{postId}').onCreate(textSearch.onPostCreated);

exports.notificationBazl = functions.https.onRequest(pushController.pushNotification)
