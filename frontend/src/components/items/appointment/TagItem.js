import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './AppointmentItem.css';

const TagItem = props => {
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
            Tag: <span className="bold">{props.tag}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
              {props.canDelete === true && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.tag)}>Delete</Button>
              )}
            </Row>
            )}
        </Card.Body>
      </Card>
    </li>
  )
}

export default TagItem;
