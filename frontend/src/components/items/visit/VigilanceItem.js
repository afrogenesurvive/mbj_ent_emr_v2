import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import './visitItem.css';

const VigilanceItem = (props) => {
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
            number: <span className="bold">{props.key}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row>
              <p>chronicIllness: diabetes</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.diabetes.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.diabetes.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.diabetes.comment}</span>
              </Card.Text>

              <p>chronicIllness: High BloodPressure</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.hbp.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.hbp.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.hbp.comment}</span>
              </Card.Text>

              <p>chronicIllness: dyslipidemia</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.comment}</span>
              </Card.Text>

              {props.canDelete === true && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.vigilance)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default VigilanceItem;
