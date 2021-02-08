import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
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
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

import './visitItem.css';

const VisitItem = props => {

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
          {props.visit.date.length === 12 && (
            <Card.Text className="cardText">
              Date: <span className="bold">{moment.unix(props.visit.date.substr(0,9)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}
          {props.visit.date.length === 13 && (
            <Card.Text className="cardText">
              Date: <span className="bold">{moment.unix(props.visit.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}
          <Card.Text className="cardText">
            Time: <span className="bold">{props.visit.time}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Title: <span className="bold">{props.visit.title}</span>
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

          {!props.patientPage && (
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Go to Visit Details</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon" onClick={props.showDetails.bind(this, props.visit)}/>
            </OverlayTrigger>

          )}

          {props.patientPage && (
            <Link
              to={{
                pathname: "/visits",
                state: {visit: props.visit._id}
              }}
            >
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Go to Visit Details</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
            </OverlayTrigger>

            </Link>
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
                Id: <span className="bold">{props.visit._id}</span>
              </Card.Text>
              </li>
              <li>
              {props.visit.date.length === 12 && (
                <Card.Text className="cardText">
                  Date: <span className="bold">{moment.unix(props.visit.date.substr(0,9)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              {props.visit.date.length === 13 && (
                <Card.Text className="cardText">
                  Date: <span className="bold">{moment.unix(props.visit.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              </li>
              <li>
              <Card.Text className="cardText">
                type: <span className="bold">{props.visit.type}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                subType: <span className="bold">{props.visit.subType}</span>
              </Card.Text>
              </li>
              {!props.patientPage && (
                <li>
                <Card.Text className="cardText">
                  Patient:
                </Card.Text>
                </li>
              )}
              {!props.patientPage && (
                <li>
                <Card.Text className="cardText">
                  Id: <span className="bold">{props.visit.patient._id}</span>
                </Card.Text>
                </li>
              )}
              {!props.patientPage && (
                <li>
                <Card.Text className="cardText">
                  Name: <span className="bold">{props.visit.patient.name}</span>
                </Card.Text>
                </li>
              )}

            </ul>
            </Row>
          )}
          {deleteState === true && (
            <Row className="listItemHiddenRow">
              {props.canDelete === true && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.visit)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default VisitItem;
