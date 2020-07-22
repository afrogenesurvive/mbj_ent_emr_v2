import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import './UserItem.css';

const FileItem = (props) => {
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
            Name: <span className="bold">{props.file.name}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Type: <span className="bold">{props.file.type}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Link: <span className="bold">{props.file.path}</span>
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

export default FileItem;
