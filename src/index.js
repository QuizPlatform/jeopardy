import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase/app';
import 'firebase/analytics';

var firebaseConfig = {
  apiKey: "AIzaSyB1mz728tc9dqKGLUiPOAwxBxg20Gx4mSE",
  authDomain: "quizpriyam.firebaseapp.com",
  databaseURL: "https://quizpriyam.firebaseio.com",
  projectId: "quizpriyam",
  storageBucket: "quizpriyam.appspot.com",
  messagingSenderId: "968131692426",
  appId: "1:968131692426:web:467ddbadc7ef1ac1d4ea73",
  measurementId: "G-WQTBNGZXQS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
