import React, { PureComponent } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import ReactLoading from 'react-loading';
import Quiz2 from './components/Quiz2';

import LoginHandler2 from './components/des';
import { Grid, Slide, Dialog, DialogActions, DialogTitle, DialogContent, Button, DialogContentText } from '@material-ui/core';
import './App.css'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      secretId: '',
      loginLoading: false,
      err: null,
      failDialog: false,
      failMsg: "Login Failed!"
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
          this.setState({
            failDialog: true,
            failMsg: 'Login Failed'
          });
        }
      }).catch(err => {
        this.setState({
          failDialog: true,
          failMsg: 'Something went Wrong!'
        });
      }).finally(() => {
        this.setState({ loginLoading: false });
      });
  }

  handleClickOpen = () => {
    this.setState({
      failDialog: true,
    });
  };

  handleClose = () => {
    this.setState({
      failDialog: false,
    });
  };

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
      </Grid>,

      <Dialog
        open={this.state.failDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{this.state.failMsg}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Check your secret Id and try again!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.handleClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
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