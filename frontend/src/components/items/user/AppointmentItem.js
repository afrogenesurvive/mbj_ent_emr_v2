import React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';

import './UserItem.css';

const AppointmentItem = props => (
  <li key={props.key} className="">
    <Card>
      <Card.Body className="cardBody">
        <Card.Text className="cardText">
          Title: <span className="bold">{props.appointment.title}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Type: <span className="bold">{props.appointment.type}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Date: <span className="bold">{props.appointment.date}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Time: <span className="bold">{props.appointment.time}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  </li>
);

export default AppointmentItem;
