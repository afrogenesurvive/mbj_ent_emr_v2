import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faEye,
  faTrashAlt,
  faHighlighter,
  faExclamation
} from '@fortawesome/free-solid-svg-icons';

import './UserItem.css';

const ImageItem = (props) => {

  let liClass;
  if (props.image.highlighted === false) {
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
          <img src={props.image.path} className="imgPreview" />
          <a href={props.image.path} target="_blank" rel="noopener noreferrer">{props.image.name}</a>
          </Card.Text>

          <OverlayTrigger
            
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
            
            placement={'top'}
            overlay={
              <Popover id={`popover-positioned-${'top'}`}>
                <Popover.Content>
                  <strong>Toggle Highlight</strong>
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleStaffImageHighlighted.bind(this, props.image)}/>
          </OverlayTrigger>

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Name: <span className="bold">{props.image.name}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.image.type}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Link: <span className="bold">{props.image.path}</span>
              </Card.Text>
              </li>
              {props.canDelete === true && (
                <li>

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
                  <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
                </OverlayTrigger>

                </li>
              )}
              {deleteState === true && (
                <li>
                <Row className="listItemHiddenRow">
                  {props.canDelete && (
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.image)}>Delete</Button>
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

export default ImageItem;
