import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AuthContext from '../../context/auth-context';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import io from 'socket.io-client';

import './landingPage.css';


class LandingPage extends Component {
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
                <Grid item lg={10} className="grid">
                  <Paper elevation={5} className='paper'>
                    <h1>Welcome to Your ENT EMR</h1>
                  </Paper>
                </Grid>
                <Grid item lg={8} className="grid">
                  <Paper elevation={5} className='paper'>
                    <p>
                      The first thing you'll want to do is sign up. If you already have an account and password, then login.
                    </p>
                  </Paper>
                </Grid>
                <Grid item lg={6} className="grid">
                  <Paper elevation={5} className='paper'>
                    <h4>Login</h4>
                    <NavLink to="/login">
                      <Button variant="contained">Default: {this.props.title}</Button>
                    </NavLink>
                  </Paper>
                </Grid>
                <Grid item lg={6} className="grid">
                  <Paper elevation={5} className='paper'>
                    <h4>Sign-Up</h4>
                    <NavLink to="/signup">
                      <Button variant="contained">Default: {this.props.title}</Button>
                    </NavLink>
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

export default LandingPage;
