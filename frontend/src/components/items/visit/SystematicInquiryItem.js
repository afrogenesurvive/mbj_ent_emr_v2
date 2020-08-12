import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faEye,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import PatientAttachmentList from '../../lists/patient/PatientAttachmentList';

import './visitItem.css';

const SystematicInquiryItem = props => {
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
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Title: <span className="bold">{props.systematicInquiry.title}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
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
                Attachments: <FontAwesomeIcon icon={faPlusSquare} className="listIcon" onClick={props.onAddAttachment.bind(this, {field: 'systematicInquiry',data:props.systematicInquiry})}/>
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
                  <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
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
