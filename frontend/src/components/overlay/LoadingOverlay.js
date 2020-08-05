import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import "./loadingOverlay.css"

const LoadingOverlay = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="loadingOverlay">

      <h5 className="attachmentViewerTitle">... {props.status.type} ...</h5>

      <Container className="overlayContainer">
        {props.status.type === 'calendarAppointment' && (
          <React.Fragment>
            <Row className="overlayRow">
              <p>{props.status.data._id}</p>
            </Row>
            <Row className="overlayRow">
              <Button variant="outline-primary" size="sm" onClick={props.selectCalendarDetails.bind(this, props.status.data)}>Details</Button>
            </Row>
          </React.Fragment>
        )}
        {props.status.type === 'calendarVisit' && (
          <Row className="overlayRow">
            <p>{props.status.data._id}</p>
            <Button variant="outline-primary" size="sm" onClick={props.selectCalendarDetails.bind(this, props.status.data)}>Details</Button>
          </Row>
        )}

        {props.toggleOverlay && (
          <Button className="sidebarButton" variant="warning" onClick={props.toggleOverlay}>X</Button>
        )}
      </Container>

    </div>
  </div>
)

}

export default LoadingOverlay;
