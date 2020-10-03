import React, { PureComponent } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import ReactLoading from 'react-loading';

class Quiz extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      round: '',
      roundLoading: true,
      err: null
    }

    this.firebaseListener = '';

    // TOOD add realtime later
  }

  componentDidMount() {
    this.firebaseListener = firebase.firestore().collection('admin')
      .doc('adminControls069')
      .onSnapshot(
        (snap) => {

          // console.log('Prediction data', predictionData);
          const round = snap.data()['round'];

          this.setState({
            round: round,
            roundLoading: false
          });
        },
        (err) => {
          this.setState({
            err: 'Something Went Wrong',
            roundLoading: false
          });
        },
      );
  }

  componentWillUnmount() {
    try {
      this.firebaseListener();
    } catch (error) {
      console.log("Ignore Error in predict");
    }
  }

  handleAnswerSubmit = (event) => {
    event.preventDefault();

    // Update the answer here
    // firebase.firestore()
    //   .collection('registered')
    //   .doc(this.props.secretId)
    //   .update({
    //     answers: 'Hello' 
    //   });
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
      if (round === 'waiting') {
        return 'Quiz is Yet to start';
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
                  placeholder="Enter Your Answer Here">
                </textarea>
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success" style={{ width: "100%" }} >Submit</button>
              </div>
            </form>

          </div>
        );
      }
    }
  }
}

export default Quiz
