import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import PatientAttachmentList from '../../lists/patient/PatientAttachmentList';

import './visitItem.css';

const DiagnosisItem = props => {
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
            Title: <span className="bold">{props.diagnosis.title}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Type: <span className="bold">{props.diagnosis.type}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row>
              <Card.Text className="cardText">
                Title: <span className="bold">{props.diagnosis.title}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.diagnosis.type}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.diagnosis.description}</span>
              </Card.Text>
              <PatientAttachmentList
                item={props.diagnosis}
                attachments={props.diagnosis.attachments}
                canDelete={props.canDelete}
                onDelete={props.deleteAttachment}
                type="diagnosis"
              />
              <Button variant="outline-primary" onClick={props.onAddAttachment.bind(this, {field: 'diagnosis',data:props.diagnosis})}>Add Attachment</Button>
              {props.canDelete === true && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.diagnosis)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default DiagnosisItem;
