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
  faExternalLinkAlt,
  faHighlighter,
  faExclamation
} from '@fortawesome/free-solid-svg-icons';
import PatientAttachmentList from '../../lists/patient/PatientAttachmentList';

import './visitItem.css';

const ExaminationItem = props => {
  let liClass;
  if (props.examination.highlighted === false) {
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
            General: <span className="bold">{props.examination.general}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Area: <span className="bold">{props.examination.area}</span>
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
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleVisitExaminationHighlighted.bind(this, props.examination)}/>
          </OverlayTrigger>

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                General: <span className="bold">{props.examination.general}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Area: <span className="bold">{props.examination.area}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Inspection: <span className="bold">{props.examination.inspection}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Palpation: <span className="bold">{props.examination.palpation}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Percussion: <span className="bold">{props.examination.percussion}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Auscultation: <span className="bold">{props.examination.auscultation}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.examination.description}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                 FollowUp: <span className="bold">{props.examination.followUp === true ?(<FontAwesomeIcon icon={faCheckSquare} className="listIcon"/>):(<FontAwesomeIcon icon={faBan} className="listIcon"/>)}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Attachments:
                <OverlayTrigger
                  
                  placement={'top'}
                  overlay={
                    <Popover id={`popover-positioned-${'top'}`}>
                      <Popover.Content>
                        <strong>Add Attachment</strong>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <FontAwesomeIcon icon={faPlusSquare} className="listIcon" onClick={props.onAddAttachment.bind(this, {field: 'examination',data:props.examination})}/>
                </OverlayTrigger>

              </Card.Text>
              <PatientAttachmentList
                item={props.examination}
                attachments={props.examination.attachments}
                canDelete={props.canDelete}
                onDelete={props.deleteAttachment}
                type="examination"
              />
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
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.examination)}>Delete</Button>
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

export default ExaminationItem;
