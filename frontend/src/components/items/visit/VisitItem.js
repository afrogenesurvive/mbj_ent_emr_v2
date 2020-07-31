import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <li key={props.key} className="">
      <Card>
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Date: <span className="bold">{props.visit.date}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Time: <span className="bold">{props.visit.time}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Title: <span className="bold">{props.visit.title}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row>
              <Card.Text className="cardText">
                Id: <span className="bold">{props.visit._id}</span>
              </Card.Text>
              <Card.Text className="cardText">
                type: <span className="bold">{props.visit.type}</span>
              </Card.Text>
              <Card.Text className="cardText">
                subType: <span className="bold">{props.visit.subType}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Patient: <span className="bold">{props.visit.patient._id}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Name: <span className="bold">{props.visit.patient.name}</span>
              </Card.Text>
              <Button variant="outline-primary" onClick={props.showDetails.bind(this, props.visit)}>Details</Button>
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
