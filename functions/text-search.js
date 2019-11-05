const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_POSTS_INDEX_NAME = 'posts';
const ALGOLIA_PRODUCTS_INDEX_NAME = 'products';
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

const onPostCreated = (snap, context) => {
  // Get the note document
  const note = snap.data();
  // Add an 'objectID' field which Algolia requires
  note.objectID = context.params.postId;
  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME);
  return index.saveObject(note);
};

const onProductCreated = (snap, context) => {
  // Get the note document
  const note = snap.data();
  // Add an 'objectID' field which Algolia requires
  note.objectID = context.params.productId;
  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_PRODUCTS_INDEX_NAME);
  return index.saveObject(note);
};

module.exports = {
  onPostCreated,
  onProductCreated
};
