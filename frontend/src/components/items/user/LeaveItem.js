import React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';

import './UserItem.css';

const LeaveItem = props => (
  <li key={props.key} className="">
    <Card>
      <Card.Body className="cardBody">
        <Card.Text className="cardText">
          Type: <span className="bold">{props.leave.type}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Start: <span className="bold">{props.leave.startDate}</span>
        </Card.Text>
        <Card.Text className="cardText">
          End: <span className="bold">{props.leave.endDate}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Description: <span className="bold">{props.leave.description}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  </li>
);

export default LeaveItem;
