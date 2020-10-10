import React, { PureComponent } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import ReactLoading from 'react-loading';
import Quiz2 from './components/Quiz2';

import LoginHandler2 from './components/des';
import { Grid } from '@material-ui/core';
import './App.css'

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      secretId: '',
      loginLoading: false,
      err: null
    }
  }

  loginSubmitHandler = (val) => {
    // console.log(val);

    this.setState({
      loginLoading: true
    })

    firebase.firestore().collection('registered')
      .doc(val).get().then(doc => {
        if (doc.exists) {
          // Yeah finally success
          // console.log("Successful", val);
          this.setState({
            secretId: val
          });
        } else {
          alert('Incorrect Password');
        }
      }).catch(err => {
        alert('Something Went Wrong');
      }).finally(() => {
        this.setState({ loginLoading: false });
      });
  }

  render() {

    let credits = (
      <Grid container spacing={2} style={{ marginTop: "auto" }} >
        <Grid item md={6} style={{ textAlign: "center" }}>
          <a target="_none" href="https://pnotes.web.app">Click Here for Rules</a>
        </Grid>
        <Grid item md={6} style={{ textAlign: "center" }}>
          © CheckM8 - Maintained by {` `}
          <a target="_none" href="https://dehla.herokuapp.com">Dehla Pakad </a>
          Team
        </Grid>
      </Grid>
    );

    if (this.state.loginLoading) {
      //Currenlty the round is loading
      return (
        <div className="loading-container">
          <ReactLoading
            type={"cylon"}
            style={{ margin: "auto", maxWidth: "320px" }} />
        </div>
      );
    } else {

      const secretId = this.state.secretId;

      if (secretId) {
        return (
          <div id="main" key={0}>
            <Quiz2 secretId={secretId} />
            {credits}
          </div>
        )
      } else {
        return (
          <div id="main" key={0}>
            <div id="main-login-container" style={{ marginTop: "48px" }}>
              <LoginHandler2 submitHandler={this.loginSubmitHandler} />
            </div>
            {credits}
          </div>
        )
      }
    }
  }
}

export default App