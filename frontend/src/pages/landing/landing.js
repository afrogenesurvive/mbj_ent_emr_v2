import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client';

import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';
import './landing.css';

class LandingPage extends Component {
  state = {
    role: null,
    userAlert: "landing page",
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
  };

  // constructor(props) {
  //   super(props);
  //   this.socket = io('http://localhost:9099');
  // }

componentDidMount () {
  // this.socket.on('toast', function(data) {
  //   console.log("admin msg...",data);
  // });
}

  render() {

    return (
      <React.Fragment>

      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}
      <Container className="landingPageContainer">

      <Row className="landingPageRow">
      <Col className="landingPageCol">
        <h1> Welcome to MBJ ENT EMR</h1>
      </Col>
      </Row>


          {
            // this.state.isGuest === true && (
            //   <NavLink to="/login">Login</NavLink>
            // )
          }
          {
            // this.state.isGuest === true && (
            //   <NavLink to="/signup">Signup</NavLink>
            // )
          }

      </Container>

      </React.Fragment>
    );

  }


}

export default LandingPage;
