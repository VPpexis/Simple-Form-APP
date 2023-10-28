import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const config = {
    databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}-default-rtdb.asia-southeast1.firebasedatabase.app/`,
    storageBucket: `gs://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
    projectID: process.env.REACT_APP_FIREBASE_PROJECT_ID
}

function initFirebase() {
    firebase.initializeApp(config);
}

initFirebase();

export default firebase;