import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import "./loadingOverlay.css"

const LoadingOverlay = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="loadingOverlay">

      <h5 className="attachmentViewerTitle">status : {props.status.type} ...</h5>
      {props.status.type === 'calendarAppointment' && (
        <Row>
          <p>{props.status.data._id}</p>
          <Button variant="outline-primary" size="sm" onClick={props.selectCalendarDetails.bind(this, props.status.data)}>Details</Button>
        </Row>
      )}
      {props.status.type === 'calendarVisit' && (
        <Row>
          <p>{props.status.data._id}</p>
          <Button variant="outline-primary" size="sm" onClick={props.selectCalendarDetails.bind(this, props.status.data)}>Details</Button>
        </Row>
      )}

      {props.toggleOverlay && (
        <Button className="sidebarButton" variant="warning" onClick={props.toggleOverlay}>X</Button>
      )}

    </div>
  </div>
)

}


export default LoadingOverlay;
