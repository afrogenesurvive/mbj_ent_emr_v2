import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import './UserItem.css';

const AppointmentItem = props => {
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
          <Card.Text className="cardText">
            Time: <span className="bold">{props.appointment.time}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Important: <span className="bold">{props.appointment.important === true && (<FontAwesomeIcon icon={faBatteryThreeQuarters} className="listIcon"/>)} {props.appointment.important === false && (<FontAwesomeIcon icon={faBatteryEmpty} className="listIcon"/>)}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <p>Details</p>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default AppointmentItem;
