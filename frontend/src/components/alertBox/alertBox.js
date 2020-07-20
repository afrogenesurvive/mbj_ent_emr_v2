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

import './alertBox.css';


class AlertBox extends Component {
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

        <div className="alertDiv">
          <Paper elevation={5} className='alertBoxPaper'>
            <h3>
              Alert Box
            </h3>
          </Paper>
        </div>

    )
  }

}


export default AlertBox;
