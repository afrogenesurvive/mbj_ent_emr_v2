import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import './UserItem.css';

const AttendanceItem = props => {
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
            Date: <span className="bold">{moment.unix(props.attendance.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Date: <span className="bold">{moment.unix(props.attendance.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Status: <span className="bold">{props.attendance.status}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.attendance.description}</span>
              </Card.Text>
              </li>
              {props.canDelete === true && (
                <li>
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.attendance)}>Delete</Button>
                </li>
              )}
            </ul>
            </Row>
          )}

        </Card.Body>
      </Card>
    </li>
  )
}

export default AttendanceItem;
