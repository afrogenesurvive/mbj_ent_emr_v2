import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faFolderMinus,
  faEye,
  faEraser,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import './PatientItem.css';

const AttachmentItem = props => {

  const [deleteState, setDeleteState] = useState(false);
  const handleDeleteStateChange = () => {
    if (deleteState === true) {
      setDeleteState(false);
    }
    if (deleteState === false) {
      setDeleteState(true);
    }
   }

  return (
    <li key={props.key} className="">

        <Row>
          <p>
            <span className="bold">{props.attachment}</span>
          </p>
          {props.canDelete === true && (
            <FontAwesomeIcon icon={faEraser} className="listIcon" onClick={handleDeleteStateChange}/>
          )}

          {props.canDelete === true &&
             deleteState === true && (
            <Button variant="outline-danger" onClick={props.onDelete.bind(this, {
              type: props.type,
              attachment: props.attachment,
              item: props.item
            })}>Delete</Button>
          )}
        </Row>

    </li>
  )
}

export default AttachmentItem;
