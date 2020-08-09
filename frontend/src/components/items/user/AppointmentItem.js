import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import './UserItem.css';

const AppointmentItem = (props) => {
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
            Title: <span className="bold">{props.appointment.title}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Type: <span className="bold">{props.appointment.type}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Date: <span className="bold">{moment.unix(props.appointment.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                id: <span className="bold">{props.appointment._id}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                time: <span className="bold">{props.appointment.time}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                checkinTime: <span className="bold">{props.appointment.checkinTime}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                seenTime: <span className="bold">{props.appointment.seenTime}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                location: <span className="bold">{props.appointment.location}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                description: <span className="bold">{props.appointment.description}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                inProgress: <span className="bold">{props.appointment.inProgress.toString()}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                attended: <span className="bold">{props.appointment.attended.toString()}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                important: <span className="bold">{props.appointment.important.toString()}</span>
              </Card.Text>
              </li>
              <li>
              <Link
                to={{
                  pathname: "/appointments",
                  state: {appointment: props.appointment._id}
                }}
              >Go!
              </Link>
              </li>
            </ul>
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default AppointmentItem;
