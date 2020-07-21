import React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';

import './UserItem.css';

const AddressItem = props => (
  <li key={props.key} className="">
    <Card>
      <Card.Body className="cardBody">
        <Card.Text className="cardText">
          No: <span className="bold">{props.address.number}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Street: <span className="bold">{props.address.street}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Town: <span className="bold">{props.address.town}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Parish: <span className="bold">{props.address.parish}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Country: <span className="bold">{props.address.country}</span>
        </Card.Text>
        <Card.Text className="cardText">
          Primary: <span className="bold"> {props.address.primary === true && (<FontAwesomeIcon icon={faBatteryThreeQuarters} className="listIcon"/>)} {props.address.primary === false && (<FontAwesomeIcon icon={faBatteryEmpty} className="listIcon"/>)}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  </li>
);

export default AddressItem;
