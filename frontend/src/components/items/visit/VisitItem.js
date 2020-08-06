import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

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
          <Card.Text className="cardText">
            Date: <span className="bold">{moment.unix(props.visit.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Time: <span className="bold">{props.visit.time}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Title: <span className="bold">{props.visit.title}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {props.canDelete && (
            <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
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
              {props.patientPage && (
                <li>
                <Link
                  to={{
                    pathname: "/visits",
                    state: {visit: props.visit._id}
                  }}
                >Go!
                </Link>
                </li>
              )}
              {!props.patientPage && (
                <li>
                  <Button variant="outline-primary" onClick={props.showDetails.bind(this, props.visit)}>Details</Button>
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
