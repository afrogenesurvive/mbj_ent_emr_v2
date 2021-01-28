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
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

import './PatientItem.css';

const PatientItem = (props) => {

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
    <li key={props.count} className="">
      <Card>
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Username: <span className="bold">{props.patient.username}</span>
          </Card.Text>
          <Card.Text className="cardText">
            role: <span className="bold">{props.patient.role}</span>
          </Card.Text>

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

          {props.appointmentPage !== true &&
            props.showDetails && (
              <OverlayTrigger

                placement={'top'}
                overlay={
                  <Popover id={`popover-positioned-${'top'}`}>
                    <Popover.Content>
                      <strong>Go to Patient Details</strong>
                    </Popover.Content>
                  </Popover>
                }
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon" onClick={props.showDetails.bind(this, props.patient)}/>
              </OverlayTrigger>

          )}

          {props.homePage && (
            <Link
              to={{
                pathname: "/patients",
                state: {patient: props.patient._id}
              }}
            >
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Go to Patient Details</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
            </OverlayTrigger>

            </Link>
          )}

          {props.appointmentPage === true && (
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Add/Use Patient</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faUserPlus} className="listIcon" onClick={props.onSelect.bind(this, props.patient)}/>
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
                id: <span className="bold">{props.patient._id}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Regno: <span className="bold">{props.patient.registration.number}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                name: <span className="bold">{props.patient.name}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                username: <span className="bold">{props.patient.username}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                title: <span className="bold">{props.patient.title}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                role: <span className="bold">{props.patient.role}</span>
              </Card.Text>
              </li>
              <li>
              {props.patient.dob.length == 13 && (
                <Card.Text className="cardText">
                  dob: <span className="bold">{moment.unix(props.patient.dob.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              {props.patient.dob.length == 12 && (
                <Card.Text className="cardText">
                  dob: <span className="bold">{moment.unix(props.patient.dob.substr(0,9)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              </li>
              <li>
              <Card.Text className="cardText">
                age: <span className="bold">{props.patient.age}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                gender: <span className="bold">{props.patient.gender}</span>
              </Card.Text>
              </li>


            </ul>
            </Row>
          )}
          {deleteState === true && (
            <Row className="listItemHiddenRow">
              {props.canDelete && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.patient)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default PatientItem;
