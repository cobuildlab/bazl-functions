const functions = require('firebase-functions');
const textSearch = require('./text-search');

exports.onPostCreated = functions.firestore.document('posts/{postId}').onCreate(textSearch.onPostCreated);
