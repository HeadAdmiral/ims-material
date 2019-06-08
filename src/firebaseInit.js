import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA5bM2rJ6mshQwnGTReI0aThyFZe2mBXHU",
    authDomain: "devicepitstop-ims.firebaseapp.com",
    databaseURL: "https://devicepitstop-ims.firebaseio.com",
    projectId: "devicepitstop-ims",
    storageBucket: "devicepitstop-ims.appspot.com",
    messagingSenderId: "224432485500"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
// firebaseApp.firestore().settings({
//     timestampsInSnapshots: true
// });

export default firebaseApp.firestore()
