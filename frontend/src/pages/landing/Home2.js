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

class HomePage2 extends Component {
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
      <Container className="loginPageContainer">

      <Row className="loginPageContainerRow2">
      <Col className="loginPageContainerCol2">
        <h1> MBJ ENT EMR Home2</h1>
      </Col>
      <Col className="loginPageContainerCol2">

      </Col>
      <Col className="loginPageContainerCol2">
        <p>.</p>
      </Col>
      </Row>
      </Container>

      </React.Fragment>
    );

  }


}

export default HomePage2;
