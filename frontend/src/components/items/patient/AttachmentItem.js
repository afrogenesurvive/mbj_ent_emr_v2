import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
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

          <a href={props.attachment} target="_blank" rel="noopener noreferrer">{props.attachment}</a>

          {props.canDelete === true && (
            <OverlayTrigger
              
              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Delete!?</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faEraser} className="listIcon" onClick={handleDeleteStateChange}/>
            </OverlayTrigger>

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
