import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
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

import './queueItem.css';

const QueueSlotItem = props => {

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
            Number: {props.queueSlot.number}
          </Card.Text>

          <Card.Text className="cardText">
            Patient: {props.queueSlot.patient.name}
          </Card.Text>
          <Link
            to={{
              pathname: "/patients",
              state: {patient: props.queueSlot.patient._id}
            }}
          >
          <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
          </Link>

          <Card.Text className="cardText">
            Seen: {props.queueSlot.seen === true ?(<FontAwesomeIcon icon={faCheckSquare} className="listIcon"/>):(<FontAwesomeIcon icon={faBan} className="listIcon"/>)}
          </Card.Text>

          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              {props.queueSlot.seen !== true && (
                <Button variant="outline-success" onClick={props.slotSeen.bind(this, props.queueSlot)}>Seen</Button>
              )}
              {props.queueSlot.seen === true && (
                <Button variant="outline-success" onClick={props.slotUnseen.bind(this, props.queueSlot)}>Un-See</Button>
              )}
              <li>

              </li>
              <li>
              <Card.Text className="cardText">
                Time: {props.queueSlot.time}
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Consultant: {props.queueSlot.consultant.username}
              </Card.Text>
              <Link
                to={{
                  pathname: "/staff",
                  state: {user: props.queueSlot.consultant._id}
                }}
              >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
              </Link>
              </li>
              <li>
              <Card.Text className="cardText">
                Seen: {props.queueSlot.seen === true ?(<FontAwesomeIcon icon={faCheckSquare} className="listIcon"/>):(<FontAwesomeIcon icon={faBan} className="listIcon"/>)}
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
              SeenTime:
              </Card.Text>

              {props.queueSlot.seenTime && (
                <Card.Text className="cardText">
                {props.queueSlot.seenTime}
                </Card.Text>
              )}

              </li>
              <li>
              <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
              </li>
              {deleteState === true && (
                <li>
                <Row className="listItemHiddenRow">
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.queueSlot)}>Delete</Button>
                </Row>
                </li>
              )}
            </ul>
            </Row>
          )}


        </Card.Body>
      </Card>
    </li>
  )
};

export default QueueSlotItem;
