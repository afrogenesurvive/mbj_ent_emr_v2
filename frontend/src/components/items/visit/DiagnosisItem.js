import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faFolderMinus,
  faEye,
  faEraser,
  faTrashAlt,
  faBan,
  faCheckSquare,
  faHighlighter,
  faExclamation
} from '@fortawesome/free-solid-svg-icons';
import PatientAttachmentList from '../../lists/patient/PatientAttachmentList';

import './visitItem.css';

const DiagnosisItem = props => {
  let liClass;
  if (props.diagnosis.highlighted === false) {
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
            Title: <span className="bold">{props.diagnosis.title}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Type: <span className="bold">{props.diagnosis.type}</span>
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
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleVisitDiagnosisHighlighted.bind(this, props.diagnosis)}/>
          </OverlayTrigger>

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Title: <span className="bold">{props.diagnosis.title}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.diagnosis.type}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.diagnosis.description}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Attachments:
                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Popover id={`popover-positioned-${'top'}`}>
                      <Popover.Content>
                        <strong>Add Attachment</strong>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <FontAwesomeIcon icon={faPlusSquare} className="listIcon" onClick={props.onAddAttachment.bind(this, {field: 'diagnosis',data:props.diagnosis})}/>
                </OverlayTrigger>

              </Card.Text>
              <PatientAttachmentList
                item={props.diagnosis}
                attachments={props.diagnosis.attachments}
                canDelete={props.canDelete}
                onDelete={props.deleteAttachment}
                type="diagnosis"
              />
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
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.diagnosis)}>Delete</Button>
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

export default DiagnosisItem;
