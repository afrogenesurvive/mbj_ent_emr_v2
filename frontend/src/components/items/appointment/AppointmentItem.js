import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
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
  faExternalLinkAlt,
  faUserPlus,
  faCalendarPlus
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

import './AppointmentItem.css';

const AppointmentItem = (props) => {
  const [state, setState] = useState(false);
  const handleStateChange = () => {
    if (state === true) {
      setState(false);
    }
    if (state === false) {
      setState(true);
    }
   }

   const [deleteState, setDeleteState] = useState(false);
   const handleDeleteStateChange = () => {
     if (deleteState === true) {
       setDeleteState(false);
     }
     if (deleteState === false) {
       setDeleteState(true);
     }
    }

  return (
    <li key={props.key} className="">
      <Card>
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Title: <span className="bold">{props.appointment.title}</span>
          </Card.Text>
          {!props.homePage && (
            <Card.Text className="cardText">
              Type: <span className="bold">{props.appointment.type}</span>
            </Card.Text>
          )}
          {!props.homePage && props.appointment.date.length === 12 && (
            <Card.Text className="cardText">
              Date: <span className="bold">{moment.unix(props.appointment.date.substr(0,9)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}
          {!props.homePage && props.appointment.date.length === 13 && (
            <Card.Text className="cardText">
              Date: <span className="bold">{moment.unix(props.appointment.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}
          {props.homePage && (
            <Card.Text className="cardText">
              Patient: <span className="bold">{props.appointment.patient._id}</span>
            </Card.Text>
          )}

          <OverlayTrigger

            placement={'top'}
            overlay={
              <Popover id={`popover-positioned-${'top'}`}>
                <Popover.Content>
                  <strong>More Info</strong>
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          </OverlayTrigger>

          {props.visitPage !== true &&
            props.showDetails && (
              <OverlayTrigger

                placement={'top'}
                overlay={
                  <Popover id={`popover-positioned-${'top'}`}>
                    <Popover.Content>
                      <strong>Go To Appointment Details</strong>
                    </Popover.Content>
                  </Popover>
                }
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon" onClick={props.showDetails.bind(this, props.appointment)}/>
              </OverlayTrigger>

          )}

          {props.homePage && (
            <Link
              to={{
                pathname: "/appointments",
                state: {appointment: props.appointment._id}
              }}
            >
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Go To Appointment Details</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
            </OverlayTrigger>

            </Link>
          )}

          {props.visitPage === true && (
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Add/Use Appointment</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faCalendarPlus} className="listIcon" onClick={props.onSelect.bind(this, props.appointment)}/>
            </OverlayTrigger>

          )}

          {props.canDelete && (
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Delete!?</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
            </OverlayTrigger>

          )}

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                id: <span className="bold">{props.appointment._id}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Title: <span className="bold">{props.appointment.title}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.appointment.type}</span>
              </Card.Text>
              </li>
              <li>
              {props.appointment.date.length === 12 && (
                <Card.Text className="cardText">
                  Date: <span className="bold">{moment.unix(props.appointment.date.substr(0,9)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              {props.appointment.date.length === 13 && (
                <Card.Text className="cardText">
                  Date: <span className="bold">{moment.unix(props.appointment.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              </li>
              <li>
              <Card.Text className="cardText">
                time: <span className="bold">{props.appointment.time}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Patient: <span className="bold">{props.appointment.patient.name}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                checkinTime: <span className="bold">{props.appointment.checkinTime}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                seenTime: <span className="bold">{props.appointment.seenTime}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                location: <span className="bold">{props.appointment.location}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                description: <span className="bold">{props.appointment.description}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                inProgress: <span className="bold">{props.appointment.inProgress.toString()}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                attended: <span className="bold">{props.appointment.attended.toString()}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                important: <span className="bold">{props.appointment.important.toString()}</span>
              </Card.Text>
              </li>

            </ul>
            </Row>
          )}
          {deleteState === true && (
            <Row>
              {props.canDelete && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.appointment)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default AppointmentItem;
