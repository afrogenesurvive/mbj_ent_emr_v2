import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import loadingGif from '../../assets/loading.gif';

import "./loadingOverlay.css"

const LoadingOverlay = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="loadingOverlay">

    {props.status && (
      <h5 className="attachmentViewerTitle">... {props.status.type} ...</h5>
    )}


      <Container className="overlayContainer">
        {props.status.type === 'calendarAppointment' && (
          <React.Fragment>
            <Row className="overlayRow">
              <p>ID: {props.status.data._id}</p>
              <p>date{props.status.data.date}</p>
              <p>title{props.status.data.title}</p>
              <p>type{props.status.data.type}</p>
              <p>subType{props.status.data.subType}</p>
              <p>time{props.status.data.time}</p>
              <p>location{props.status.data.location}</p>
              <p>important{props.status.data.important}</p>
              <p>description{props.status.data.description}</p>
            </Row>
            {props.selectCalendarDetails && (
              <Row className="overlayRow">
                <Button variant="outline-primary" size="sm" onClick={props.selectCalendarDetails.bind(this, props.status.data)}>Details</Button>
              </Row>
            )}
            {props.status.goLink && (
              <Link
                to={{
                  pathname: "/appointments",
                  state: {appointment: props.status.data._id}
                }}
              >Go!
              </Link>
            )}
          </React.Fragment>
        )}

        {props.status.type === 'calendarVisit' && (
          <React.Fragment>
          <Row className="overlayRow">
            <p>Id: {props.status.data._id}</p>
            <p>date: {props.status.data.date}</p>
            <p>timee: {props.status.data.timee}</p>
            <p>title: {props.status.data.title}</p>
            <p>type: {props.status.data.type}</p>
            <p>subType: {props.status.data.subType}</p>
            {props.selectCalendarDetails && (
              <Row className="overlayRow">
                <Button variant="outline-primary" size="sm" onClick={props.selectCalendarDetails.bind(this, props.status.data)}>Details</Button>
              </Row>
            )}
            {props.status.goLink && (
              <Link
                to={{
                  pathname: "/visits",
                  state: {visit: props.status.data._id}
                }}
              >Go!
              </Link>
            )}
          </Row>
          </React.Fragment>
        )}
        {props.status.type === 'calendarAttendance' && (
          <React.Fragment>
          <Row className="overlayRow">
            <p>Date: {props.status.data.date}</p>
            <p>Status: {props.status.data.status}</p>
            <p>Description: {props.status.data.description}</p>

          </Row>
          </React.Fragment>
        )}
        {props.status.type === 'calendarLeave' && (
          <React.Fragment>
          <Row className="overlayRow">
            <p>Type: {props.status.data.type}</p>
            <p>startDate: {props.status.data.startDate}</p>
            <p>endDate: {props.status.data.endDate}</p>
            <p>Description: {props.status.data.description}</p>

          </Row>
          </React.Fragment>
        )}
        {props.status.type === 's3' && (
          <React.Fragment>
          <Row className="overlayRow">
            <p>{props.status.data.action} -ing {props.status.data.target}...</p>

          </Row>
          <Row className="overlayRow">
            <Image src={loadingGif} className="loadingGif" fluid />
          </Row>
          </React.Fragment>
        )}

        {props.toggleOverlay &&
          props.status.type !== 's3' && (
          <Button className="sidebarButton" variant="warning" onClick={props.toggleOverlay}>X</Button>
        )}
      </Container>

    </div>
  </div>
)

}

export default LoadingOverlay;
