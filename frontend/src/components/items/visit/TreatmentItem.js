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
  faHighlighter,
  faExclamation,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import PatientAttachmentList from '../../lists/patient/PatientAttachmentList';

import './visitItem.css';

const TreatmentItem = props => {
  let liClass;
  if (props.treatment.highlighted === false) {
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
            Title: <span className="bold">{props.treatment.title}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Type: <span className="bold">{props.treatment.type}</span>
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
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleVisitTreatmentHighlighted.bind(this, props.treatment)}/>
          </OverlayTrigger>

          {props.canUpdate === true && (
            <OverlayTrigger

              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Edit</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faEdit} className="listIcon" onClick={props.startUpdate.bind(this, {field: 'treatment', data: props.treatment})}/>
            </OverlayTrigger>
          )}

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Title: <span className="bold">{props.treatment.title}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.treatment.type}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.treatment.description}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Dose: <span className="bold">{props.treatment.dose}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Frequency: <span className="bold">{props.treatment.frequency}</span>
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
                  <FontAwesomeIcon icon={faPlusSquare} className="listIcon" onClick={props.onAddAttachment.bind(this, {field: 'treatment',data:props.treatment})}/>
                </OverlayTrigger>

              </Card.Text>
              <PatientAttachmentList
                item={props.treatment}
                attachments={props.treatment.attachments}
                canDelete={props.canDelete}
                onDelete={props.deleteAttachment}
                type="treatment"
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
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.treatment)}>Delete</Button>
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

export default TreatmentItem;
