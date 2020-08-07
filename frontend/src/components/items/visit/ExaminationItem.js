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

const ExaminationItem = props => {
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
            General: <span className="bold">{props.examination.general}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Area: <span className="bold">{props.examination.area}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
              <Card.Text className="cardText">
                General: <span className="bold">{props.examination.general}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Area: <span className="bold">{props.examination.area}</span>
              </Card.Text>
              <Card.Text className="cardText">
                type: <span className="bold">{props.examination.type}</span>
              </Card.Text>
              <Card.Text className="cardText">
                measure: <span className="bold">{props.examination.measure}</span>
              </Card.Text>
              <Card.Text className="cardText">
                value: <span className="bold">{props.examination.value}</span>
              </Card.Text>
              <Card.Text className="cardText">
                description: <span className="bold">{props.examination.description}</span>
              </Card.Text>
              <Card.Text className="cardText">
                followUp: <span className="bold">{props.examination.followUp.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Attachments:
              </Card.Text>
              <PatientAttachmentList
                item={props.examination}
                attachments={props.examination.attachments}
                canDelete={props.canDelete}
                onDelete={props.deleteAttachment}
                type="examination"
              />
              <Button variant="outline-primary" onClick={props.onAddAttachment.bind(this, {field: 'examination',data:props.examination})}>Add Attachment</Button>
              {props.canDelete === true && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.examination)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default ExaminationItem;
