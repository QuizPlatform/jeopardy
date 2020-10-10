import React, { PureComponent } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import ReactLoading from 'react-loading';
import {
  Grid, Paper, TextField, Button, Typography
} from '@material-ui/core';

// Problem, if we have again moved to 2nd question from 4th question
// The answer will not be called as update works for all the values

class Quiz2 extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      round: '',
      currentAnswer: '',
      roundLoading: true,
      err: null,
      oldAnswer: ''
    }

    this.firebaseListener = '';

    // TOOD add realtime later
    this.answerListener = '';
  }

  componentDidMount() {
    this.firebaseListener = firebase.firestore().collection('admin')
      .doc('adminControls069')
      .onSnapshot(
        (snap) => {

          // console.log('Prediction data', predictionData);
          // JUST FOR TESTING
          try {
            const round = snap.data()['round'];

            this.setState({
              round: round,
              roundLoading: false
            });

          } catch (err) {
            this.setState({
              err: 'No Healthy Internet Connection, Try to Reload the Page',
              roundLoading: false
            });
          }
        },
        (err) => {
          this.setState({
            err: 'Something Went Wrong',
            roundLoading: false
          });
        },
      );

    this.answerListener = firebase.firestore().collection('registered')
      .doc(this.props.secretId)
      .onSnapshot(
        (snap) => {
          // console.log(snap.id);
          // console.log(snap.data());

          const round = this.state.round;
          const toUpdate = snap.data()['answers'][round]

          // Updating with the latest answer
          this.setState({
            currentAnswer: toUpdate,
            oldAnswer: toUpdate
          });
        },
        (err) => {
          this.setState({
            err: 'Soemthing Went Wrong',
          });
        }
      );
  }

  componentDidUpdate(prevProps, prevState) {
    const newRound = this.state.round;
    // console.log("New Round", newRound);
    // console.log(prevState.round);

    if (newRound !== prevState.round) {
      console.log("Round has been changed!");

      // Currrently clearing the previous answer
      this.setState({
        currentAnswer: '',
        oldAnswer: ''
      });

    }
  }

  componentWillUnmount() {
    try {
      this.firebaseListener();
    } catch (error) {
      console.log("Ignore Error in predict");
    }
    try {
      this.answerListener();
    } catch (error) {
      console.log("Ignore Error in predict");
    }
  }

  handleAnswerChange = (val) => {
    // console.log(val.target.value);
    this.setState({
      currentAnswer: val.target.value
    });
  }

  handleAnswerSubmit = (event) => {
    event.preventDefault();

    const currentAnswer = this.state.currentAnswer;

    firebase.firestore().collection('admin')
      .doc('adminControls069')
      .get().then(doc => {

        const toUpdateDict = {};
        toUpdateDict[doc.data()['round']] = currentAnswer;

        // console.log("Answer event called", round, currentAnswer);

        // Update the answer here, the value will come back from the snapshot listener
        firebase.firestore()
          .collection('registered')
          .doc(this.props.secretId)
          .set({
            answers: toUpdateDict
          }, { merge: true }).then(val => {
          });
        ;

      }).catch(err => {
        alert('Update Failed');
      });
  }

  render() {
    if (this.state.roundLoading) {
      //Currenlty the round is loading
      return (
        <div className="loading-container">
          <ReactLoading
            type={"cylon"}
            style={{ margin: "auto", maxWidth: "320px" }} />
        </div>
      );
    } else {

      const round = this.state.round;
      // Waiting for next round
      if (round === '0') {
        return (
          <h2 style={{ textAlign: "center", marginTop: "32px" }}>Next Round is Going to be Started soon!</h2>
        );
      }
      else {
        // The questions are running
        // Loading has finished start working
        return (

          <div id="answer-panel" style={{ marginTop: "32px" }} className="jumbotron container">

            <Grid container spacing={2} >
              <Grid item xs={1} md={1}></Grid>
              <Grid item xs={10} md={7}>
                <Paper id="answer-container" elevation={3} style={{ padding: "12px 12px 32px 12px", textAlign: "center" }} >
                  <h2 className="text-center">Answer for {` `} {this.state.round}</h2>
                  <form onSubmit={this.handleAnswerSubmit} className="from">
                    <div className="form-group">
                      <TextField
                        style={{ margin: "12px 8px 16px", width: "70%" }}
                        onChange={this.handleAnswerChange}
                        value={this.state.currentAnswer}
                        className="form-control"
                        multiline
                        placeholder="Enter your secret ID"
                        variant={"outlined"}
                        label="Write Answer"
                        required
                      />
                    </div>
                    <div style={{ display: "flex", marginTop: "8px" }}>
                      <Button variant="contained" size="small" color="primary" type="submit" style={{ margin: "auto", width: "70%" }}>Submit</Button>
                    </div>

                  </form>
                </Paper>
              </Grid>
              <Grid item md={4}>
                <div>
                  <Typography style={{ color: "#555555" }}>You can always change your answer until this Question is Open!</Typography>
                  <p> Your current Answer is </p>
                  <p style={{ fontWeight: "800", whiteSpace: "pre-line" }}>{this.state.oldAnswer}</p>
                </div>
              </Grid>
            </Grid >

          </div>
        );
      }
    }
  }
}

export default Quiz2
