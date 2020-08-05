import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './PatientItem.css';

const NoteItem = props => {
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
            Note: <span className="bold">{props.note}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
              {props.canDelete === true && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.note)}>Delete</Button>
              )}
            </Row>
            )}

        </Card.Body>
      </Card>
    </li>
  )
}

export default NoteItem;
