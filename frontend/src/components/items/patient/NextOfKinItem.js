import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './PatientItem.css';

const NextOfKinItem = props => {
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
            Name: <span className="bold">{props.nextOfKin.name}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Relation: <span className="bold">{props.nextOfKin.relation}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Name: <span className="bold">{props.nextOfKin.name}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Relation: <span className="bold">{props.nextOfKin.relation}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Email: <span className="bold">{props.nextOfKin.contact.email}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Phone: <span className="bold">{props.nextOfKin.contact.phone}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Phone2: <span className="bold">{props.nextOfKin.contact.phone2}</span>
              </Card.Text>
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
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.nextOfKin)}>Delete</Button>
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

export default NextOfKinItem;
