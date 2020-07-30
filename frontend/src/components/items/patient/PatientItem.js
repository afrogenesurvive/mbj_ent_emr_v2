import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

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
  return (
    <li key={props.key} className="">
      <Card>
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Username: <span className="bold">{props.patient.username}</span>
          </Card.Text>
          <Card.Text className="cardText">
            role: <span className="bold">{props.patient.role}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row>
              <Card.Text className="cardText">
                id: <span className="bold">{props.patient._id}</span>
              </Card.Text>
              <Card.Text className="cardText">
                name: <span className="bold">{props.patient.name}</span>
              </Card.Text>
              <Card.Text className="cardText">
                username: <span className="bold">{props.patient.username}</span>
              </Card.Text>
              <Card.Text className="cardText">
                title: <span className="bold">{props.patient.title}</span>
              </Card.Text>
              <Card.Text className="cardText">
                role: <span className="bold">{props.patient.role}</span>
              </Card.Text>
              <Card.Text className="cardText">
                dob: <span className="bold">{moment.unix(props.patient.dob.substr(0,8)).add(1,'days').format('YYYY-MM-DD')}</span>
              </Card.Text>
              <Card.Text className="cardText">
                age: <span className="bold">{props.patient.age}</span>
              </Card.Text>
              <Card.Text className="cardText">
                gender: <span className="bold">{props.patient.gender}</span>
              </Card.Text>
              {props.appointmentPage === true && (
                <Button variant="outline-primary" onClick={props.onSelect.bind(this, props.patient)}>Select</Button>
              )}
              {props.appointmentPage !== true && (
                <Button variant="outline-primary" onClick={props.showDetails.bind(this, props.patient)}>Details</Button>
              )}
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
