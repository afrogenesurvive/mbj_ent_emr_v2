import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';

import './AppointmentItem.css';

const NoteItem = props => (
  <li key={props.key} className="">
    <Card>
      <Card.Body className="cardBody">
        <Card.Text className="cardText">
          Note: <span className="bold">{props.note}</span>
        </Card.Text>
        {props.canDelete === true && (
          <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.note)}>Delete</Button>
        )}
      </Card.Body>
    </Card>
  </li>
);

export default NoteItem;
