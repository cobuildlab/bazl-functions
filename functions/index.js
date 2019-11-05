const functions = require('firebase-functions');
const textSearch = require('./text-search');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const pushController = require('./pushNotification')
const paymentController = require('./payments')

exports.onPostCreated = functions.firestore.document('posts/{postId}').onCreate(textSearch.onPostCreated);

exports.onProductCreated = functions.firestore.document('products/{productId}').onCreate(textSearch.onProductCreated);

exports.notificationBazl = functions.https.onRequest(pushController.pushNotification)

exports.proccessPayment = functions.https.onRequest(paymentController.proccessPayment)
