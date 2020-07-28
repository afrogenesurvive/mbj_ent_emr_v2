import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';

import './PatientItem.css';

const TagItem = props => (
  <li key={props.key} className="">
    <Card>
      <Card.Body className="cardBody">
        <Card.Text className="cardText">
          Tag: <span className="bold">{props.tag}</span>
        </Card.Text>
        {props.canDelete === true && (
          <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.tag)}>Delete</Button>
        )}
      </Card.Body>
    </Card>
  </li>
);

export default TagItem;
