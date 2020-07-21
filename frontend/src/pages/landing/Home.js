import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';
import './landing.css';

class HomePage extends Component {
  state = {
    role: null,
    userAlert: "landing",
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
  };

componentDidMount () {
  if (AuthContext._currentValue.activityId !== null && AuthContext._currentValue.token !== null ) {
    this.setState({isGuest: false})
  }
}

  render() {

    return (
      <React.Fragment>

      {
        this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )
    }
      <Container className="landingPageContainer">

      <Row className="landingPageRow">
      <Col className="landingPageCol">
        <h1> MBJ ENT EMR Home</h1>
      </Col>
      <Col className="landingPageCol">

      </Col>
      <Col className="landingPageCol">
        <p>.</p>
      </Col>
      </Row>
      </Container>

      </React.Fragment>
    );

  }


}

export default HomePage;
