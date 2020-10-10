import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'

export default class LoginHandler2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    // console.log('From submit called');
    // console.log('Value', this.state.inputValue);

    if (typeof this.props.submitHandler === 'function') {
      this.props.submitHandler(this.state.inputValue.trim());
    }
  }


  handleInputChange(event) {
    // console.log(event.target.value);

    let value = event.target.value;

    var format = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>/?]+/;
    if (format.test(value)) {
      alert('No special characters are allowed!');
    } else {
      this.setState({
        inputValue: value,
      });
    }

  }

  render() {
    return (
      <Grid container spacing={2} >
        <Grid item xs={2} md={4}></Grid>
        <Grid item xs={8} md={4}>
          <Paper elevation={3} style={{ padding: "12px 12px 32px 12px", textAlign: "center" }} >
            <h1>Login To Portal</h1>
            <form onSubmit={this.handleFormSubmit} className="from">
              <div className="form-group">
                <TextField
                  style={{ margin: "12px 8px" }}
                  value={this.state.inputValue}
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Enter your secret ID"
                  required
                />
              </div>
              <div style={{ display: "flex", marginTop: "8px" }}>
                <Button variant="contained" size="small" color="secondary" type="submit" style={{ margin: "auto" }}>Submit</Button>
              </div>

            </form>
          </Paper>
        </Grid>
        <Grid item xs={2} md={4}></Grid>
      </Grid >
    );
  }
}
