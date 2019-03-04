import firebase from 'firebase';

var config = {
	apiKey: "AIzaSyCiAe-im7vPt_Dl5jMq-mjNQhUEpOSPQ3I",
	authDomain: "midtownalliance-b70b8.firebaseapp.com",
	databaseURL: "https://midtownalliance-b70b8.firebaseio.com",
	projectId: "midtownalliance-b70b8",
	storageBucket: "midtownalliance-b70b8.appspot.com",
	messagingSenderId: "329653031050"
};

export const app = firebase.initializeApp(config);