import React, { PureComponent } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import LoginHandler from './components/LoginHandler'
import ReactLoading from 'react-loading';
import Quiz from './components/Quiz';

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      secretId: 'alpha',
      loginLoading: false,
      err: null
    }
  }

  loginSubmitHandler = (val) => {
    console.log(val);

    this.setState({
      loginLoading: true
    })

    firebase.firestore().collection('registered')
      .doc(val).get().then(doc => {
        if (doc.exists) {
          // Yeah finally success
          console.log("Successful", val);
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
            <Quiz secretId={secretId} />
          </div>
        )
      } else {
        return (
          <div id="main" key={0}>
            <div id="main-login-container" style={{ marginTop: "48px" }}>
              <LoginHandler submitHandler={this.loginSubmitHandler} />
            </div>
          </div>
        )
      }
    }
  }
}

export default App