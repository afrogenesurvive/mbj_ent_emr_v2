import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import moment from 'moment';
import loadingGif from '../../assets/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faFolderMinus,
  faEye,
  faEraser,
  faTrashAlt,
  faBan,
  faCheckSquare,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

import "./loadingOverlay.css"

const LoadingOverlay = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="loadingOverlay">
    <Row className="overlayCloseRow">
    {props.toggleOverlay &&
      props.status.type !== 's3' && (
      <Button className="sidebarButton" variant="warning" onClick={props.toggleOverlay}>X</Button>
    )}
    </Row>

    {
    //   props.status && (
    //   <h5 className="attachmentViewerTitle">... {props.status.type} ...</h5>
    // )
    }

      <Container className="overlayContainer">

        {props.status.type === 'calendarAppointment' && (
          <React.Fragment>
            <Row className="overlayRow">
            <ListGroup className="overlayListGroup">
              <ListGroup.Item className="overlayListGroupItem">
              {props.selectCalendarDetails && (
                <Row className="overlayRow">
                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Popover id={`popover-positioned-${'top'}`}>
                      <Popover.Content>
                        <strong>Go To Appointment Details</strong>
                      </Popover.Content>
                    </Popover>
                  }
                >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon centered_btn"  onClick={props.selectCalendarDetails.bind(this, props.status.data)}/>
                </OverlayTrigger>

                </Row>
              )}
              {props.status.goLink && (
                <Row className="overlayRow">
                <Link className="centered_btn"
                  to={{
                    pathname: "/appointments",
                    state: {appointment: props.status.data._id}
                  }}
                >
                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Popover id={`popover-positioned-${'top'}`}>
                      <Popover.Content>
                        <strong>Go To Appointment Details</strong>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon centered_btn"/>
                </OverlayTrigger>

                </Link>
                </Row>
              )}
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p className="overlayListGroupItemText">Patient: <span className="bold">{props.status.data.patient.name}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p className="overlayListGroupItemText">Date: <span className="bold">{moment.unix(props.status.data.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span></p>
              <p className="overlayListGroupItemText">Time: <span className="bold">{props.status.data.time}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p className="overlayListGroupItemText">Location: <span className="bold">{props.status.data.location}</span></p>
              <p className="overlayListGroupItemText">important: <span className="bold">{props.status.data.important === true ?(<FontAwesomeIcon icon={faCheckSquare} className="listIcon"/>):(<FontAwesomeIcon icon={faBan} className="listIcon"/>)}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p className="overlayListGroupItemText">type: <span className="bold">{props.status.data.type}</span></p>
              <p className="overlayListGroupItemText">description: <span className="bold">{props.status.data.description}</span></p>
              </ListGroup.Item>
            </ListGroup>

            </Row>

          </React.Fragment>
        )}

        {props.status.type === 'calendarVisit' && (
          <React.Fragment>
          <Row className="overlayRow">
          <ListGroup className="overlayListGroup">
            <ListGroup.Item className="overlayListGroupItem">
            {props.selectCalendarDetails && (
              <Row className="overlayRow">
              <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                  <Popover id={`popover-positioned-${'top'}`}>
                    <Popover.Content>
                      <strong>Go To Visit Details</strong>
                    </Popover.Content>
                  </Popover>
                }
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon centered_btn" onClick={props.selectCalendarDetails.bind(this, props.status.data)}/>
              </OverlayTrigger>

              </Row>
            )}
            {props.status.goLink && (
              <Row className="overlayRow">
              <Link className="centered_btn"
                to={{
                  pathname: "/visits",
                  state: {visit: props.status.data._id}
                }}
              >
              <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                  <Popover id={`popover-positioned-${'top'}`}>
                    <Popover.Content>
                      <strong>Go To Visit Details</strong>
                    </Popover.Content>
                  </Popover>
                }
              >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
              </OverlayTrigger>

              </Link>
              </Row>
            )}
            </ListGroup.Item>
            <ListGroup.Item className="overlayListGroupItem">
            <p className="overlayListGroupItemText">Patient: <span className="bold">{props.status.data.patient.name}</span></p>
            </ListGroup.Item>
            <ListGroup.Item className="overlayListGroupItem">
            <p className="overlayListGroupItemText">Date: <span className="bold">{moment.unix(props.status.data.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span></p>
            <p className="overlayListGroupItemText">Time: <span className="bold">{props.status.data.time}</span></p>
            </ListGroup.Item>
            <ListGroup.Item className="overlayListGroupItem">
            <p className="overlayListGroupItemText">type: <span className="bold">{props.status.data.type}</span></p>
            </ListGroup.Item>
          </ListGroup>
          </Row>

          </React.Fragment>
        )}

        {props.status.type === 'calendarAttendance' && (
          <React.Fragment>
          <Row className="overlayRow">
            <ListGroup className="overlayListGroup">
              <ListGroup.Item className="overlayListGroupItem">
              <p>Date: <span className="bold">{moment.unix(props.status.data.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p>Status: <span className="bold">{props.status.data.status}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p>Description: <span className="bold">{props.status.data.description}</span></p>
              </ListGroup.Item>
            </ListGroup>
          </Row>
          </React.Fragment>
        )}
        {props.status.type === 'calendarLeave' && (
          <React.Fragment>
          <Row className="overlayRow">
            <ListGroup className="overlayListGroup">
              <ListGroup.Item className="overlayListGroupItem">
              <p>Type: <span className="bold">{props.status.data.type}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p>startDate: <span className="bold">{moment.unix(props.status.data.startDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p>endDate: <span className="bold">{moment.unix(props.status.data.endDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span></p>
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
              <p>Description: <span className="bold">{props.status.data.description}</span></p>
              </ListGroup.Item>
            </ListGroup>
          </Row>
          </React.Fragment>
        )}
        {props.status.type === 's3' && (
          <React.Fragment>
          <Row className="overlayRow">
            <ListGroup className="overlayListGroup">
              <ListGroup.Item className="overlayListGroupItem">
                <Image src={loadingGif} className="loadingGif" fluid />
              </ListGroup.Item>
              <ListGroup.Item className="overlayListGroupItem">
                <p>{props.status.data.action} -ing {props.status.data.target}...</p>
              </ListGroup.Item>
            </ListGroup>
          </Row>
          <Row className="overlayRow">

          </Row>
          </React.Fragment>
        )}

        {props.status.type === 'dateClickAppointment' && (
          <h3>Create new Appt?</h3>
        )}

      </Container>

    </div>
  </div>
)

}

export default LoadingOverlay;
