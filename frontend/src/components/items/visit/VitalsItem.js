import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import {
  faEye,
  faTrashAlt
 } from '@fortawesome/free-solid-svg-icons';

import './visitItem.css';

const VitalsItem = props => {
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
            Pulse Rate: <span className="bold">{props.vitals.pr}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Respiratory Rate: <span className="bold">{props.vitals.rr}</span>
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

          {state === true && (
            <Row className="listItemHiddenRow">
              <Card.Text className="cardText">
                Pulse Rate: <span className="bold">{props.vitals.pr}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Respiratory Rate: <span className="bold">{props.vitals.rr}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Blood Pressure : <span className="bold">{props.vitals.bp1}</span> / <span className="bold">{props.vitals.bp2}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Temperature: <span className="bold">{props.vitals.temp}</span>
              </Card.Text>
              <Card.Text className="cardText">
                PS02: <span className="bold">{props.vitals.ps02}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Height : <span className="bold">{props.vitals.heightValue}</span>  <span className="bold">{props.vitals.heightUnit}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Weight : <span className="bold">{props.vitals.weightValue}</span>  <span className="bold">{props.vitals.weightUnit}</span>
              </Card.Text>
              <Card.Text className="cardText">
                BMI : <span className="bold">{props.vitals.bmi}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Urine
              </Card.Text>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.vitals.urine.type}</span> Value: <span className="bold">{props.vitals.urine.value}</span>
              </Card.Text>
              {props.canDelete === true && (
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

              )}
              {deleteState === true && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.vitals)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default VitalsItem;
