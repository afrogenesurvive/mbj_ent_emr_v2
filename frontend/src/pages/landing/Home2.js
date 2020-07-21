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
    userAlert: "home page 2",
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
  };

componentDidMount () {

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

      <Row className="landingPageContainerRow">
      <Col className="landingPageContainerCol">
        <h1> MBJ ENT EMR Home2</h1>
      </Col>
      <Col className="landingPageContainerCol">

      </Col>
      <Col className="landingPageContainerCol">
        <p>.</p>
      </Col>
      </Row>
      </Container>

      </React.Fragment>
    );

  }


}

export default HomePage2;
