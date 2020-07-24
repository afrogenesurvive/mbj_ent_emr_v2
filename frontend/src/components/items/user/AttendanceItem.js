import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import './UserItem.css';

const AttendanceItem = props => (
  <li key={props.key} className="">
    <Card>
      <Card.Body className="cardBody">
        <Card.Text className="cardText">
          Date: <span className="bold">{moment.unix(props.attendance.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Status: <span className="bold">{props.attendance.status}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Description: <span className="bold">{props.attendance.description}</span>
        </Card.Text>
        {props.canDelete === true && (
          <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.attendance)}>Delete</Button>
        )}
      </Card.Body>
    </Card>
  </li>
);

export default AttendanceItem;
