import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import PatientAttachmentList from '../../lists/patient/PatientAttachmentList';

import './PatientItem.css';

const AllergyItem = props => {
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
            Title: <span className="bold">{props.allergy.title}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Title: <span className="bold">{props.allergy.title}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.allergy.type}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.allergy.description}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                attachments:
              </Card.Text>
              <PatientAttachmentList
                item={props.allergy}
                attachments={props.allergy.attachments}
                canDelete={props.canDelete}
                onDelete={props.deleteAttachment}
                type="allergy"
              />
              </li>
              <li>
              <Button variant="outline-primary" onClick={props.onAddAttachment.bind(this, {field: 'allergy',data:props.allergy})}>Add Attachment</Button>
              </li>
              <li>
              {props.canDelete === true && (
                <li>
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.allergy)}>Delete</Button>
                </li>
              )}
              </li>

            </ul>
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default AllergyItem;
