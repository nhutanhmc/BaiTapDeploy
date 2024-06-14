const admin = require('firebase-admin');
const serviceAccount = require('../xavia-3ee10-firebase-adminsdk-paeyn-67f6b398f6.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://xavia-3ee10.firebaseio.com'
});

module.exports = admin;
