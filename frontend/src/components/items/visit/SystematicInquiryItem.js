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
  faEye,
  faTrashAlt,
  faHighlighter,
  faExclamation,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import PatientAttachmentList from '../../lists/patient/PatientAttachmentList';

import './visitItem.css';

const SystematicInquiryItem = props => {
  let liClass;
  if (props.systematicInquiry.highlighted === false) {
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
            Title: <span className="bold">{props.systematicInquiry.title}</span>
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
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleVisitSysInquiryHighlighted.bind(this, props.systematicInquiry)}/>
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
              <FontAwesomeIcon icon={faEdit} className="listIcon" onClick={props.startUpdate.bind(this, {field: 'systematicInquiry', data: props.systematicInquiry})}/>
            </OverlayTrigger>
          )}


          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Title: <span className="bold">{props.systematicInquiry.title}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.systematicInquiry.description}</span>
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
                  <FontAwesomeIcon icon={faPlusSquare} className="listIcon" onClick={props.onAddAttachment.bind(this, {field: 'systematicInquiry',data:props.systematicInquiry})}/>
                </OverlayTrigger>

              </Card.Text>
              <PatientAttachmentList
                item={props.systematicInquiry}
                attachments={props.systematicInquiry.attachments}
                canDelete={props.canDelete}
                onDelete={props.deleteAttachment}
                type="systematicInquiry"
              />
              </li>
              {props.canDelete === true && (
                <li>
                <OverlayTrigger

                  placement={'top'}
                  overlay={
                    <Popover id={`popover-positioned-${'top'}`}>
                      <Popover.Content>
                        <strong>Delete</strong>
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
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.systematicInquiry)}>Delete</Button>
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

export default SystematicInquiryItem;
