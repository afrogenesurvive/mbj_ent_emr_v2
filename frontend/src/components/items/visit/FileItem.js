import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
  faTrashAlt,
  faHighlighter,
  faExclamation
} from '@fortawesome/free-solid-svg-icons';

import './visitItem.css';

const FileItem = (props) => {
  let liClass;
  if (props.file.highlighted === false) {
    liClass = 'cardBody';
  } else {
    liClass = 'cardBodyHighlighted';
  }
  const [state, setState] = useState(false);
  const handleStateChange = () => {
    if (state === true) {
      setState(false);
    }
    if (state === false) {
      setState(true);
    }
   }

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
      <Card>
        <Card.Body className={liClass}>
        <Card.Text className="cardText">
        <a href={props.file.path} target="_blank" rel="noopener noreferrer">{props.file.name}</a>
        </Card.Text>

        <OverlayTrigger
          key={'top'}
          placement={'top'}
          overlay={
            <Popover id={`popover-positioned-${'top'}`}>
              <Popover.Content>
                <strong>More Info</strong>
              </Popover.Content>
            </Popover>
          }
        >
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
        </OverlayTrigger>


        <OverlayTrigger
          key={'top'}
          placement={'top'}
          overlay={
            <Popover id={`popover-positioned-${'top'}`}>
              <Popover.Content>
                <strong>Toggle Highlight</strong>
              </Popover.Content>
            </Popover>
          }
        >
          <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleVisitFileHighlighted.bind(this, props.file)}/>
        </OverlayTrigger>

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Name: <span className="bold">{props.file.name}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.file.type}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Link: <span className="bold">{props.file.path}</span>
              </Card.Text>
              </li>
              {props.canDelete === true && (
                <li>
                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Popover id={`popover-positioned-${'top'}`}>
                      <Popover.Content>
                        <strong>Delete!?</strong>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
                </OverlayTrigger>

                </li>
              )}
              {deleteState === true && (
                <li>
                <Row className="listItemHiddenRow">
                  {props.canDelete && (
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.file)}>Delete</Button>
                  )}
                </Row>
                </li>
              )}
            </ul>

            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default FileItem;
