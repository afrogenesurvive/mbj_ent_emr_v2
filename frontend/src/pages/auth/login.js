import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AuthContext from '../../context/auth-context';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import io from 'socket.io-client';
import StaffLoginForm from '../../components/forms/auth/staffLoginForm';

import './loginPage.css';


class LoginPage extends Component {
  state = {

  };
  static contextType = AuthContext;
  // constructor(props) {
  //   super(props);
  //   this.socket = io('http://localhost:9099');
  // }
  // componentDidMount() {
  //
  // }
  // componentWillUnmount() {
  //
  // }


  render() {
    return (
      <React.Fragment>
        <div className="topDiv">
          <Container maxWidth="lg" className="topContainer">
            <div className='root'>
              <Grid container spacing={3}>
                <Grid item lg={8} className="grid">
                  <Paper elevation={5} className='paper'>
                    <h1>Login</h1>
                  </Paper>
                </Grid>
                <Grid item lg={10} className="grid">
                  <Paper elevation={5} className='paper'>
                    <p>
                      Form
                      <StaffLoginForm />
                    </p>
                  </Paper>
                </Grid>
                <Grid item lg={8} className="grid">
                  <Paper elevation={5} className='paper'>
                    <p>
                      Instructions/Feedback
                    </p>
                    <Button variant="contained">Default: {this.props.title}</Button>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </React.Fragment>
    )
  }

}

export default LoginPage;
