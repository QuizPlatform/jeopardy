import React, { PureComponent } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import ReactLoading from 'react-loading';


// Problem, if we have again moved to 2nd question from 4th question
// The answer will not be called as update works for all the values

class Quiz extends PureComponent {
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
          <h2>Next Round is Going to be Started soon!</h2>
        );
      }
      else {
        // The questions are running
        // Loading has finished start working
        return (
          <div id="answer-panel" style={{ marginTop: "32px" }} className="jumbotron container">
            <form className="form" onSubmit={this.handleAnswerSubmit}>
              <h2 className="text-center">Answer for {` `} {this.state.round}</h2>
              <div className="form-group">
                <textarea
                  id="answer-text-area"
                  className="form-control"
                  onChange={this.handleAnswerChange}
                  value={this.state.currentAnswer}
                  placeholder="Enter Your Answer Here">
                </textarea>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success" style={{ width: "100%" }} >Submit</button>
              </div>
            </form>

            <div>
              <h3> Your current Answer is </h3>
              <p>{this.state.oldAnswer}</p>
              <p>You can always change your answer until this Question is Open!</p>
            </div>

          </div>
        );
      }
    }
  }
}

export default Quiz
