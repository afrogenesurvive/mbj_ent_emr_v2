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
  faTrashAlt,
  faHighlighter,
  faExclamation,
  faEdit,
 } from '@fortawesome/free-solid-svg-icons';

import './visitItem.css';

const VitalsItem = props => {
  let liClass;
  if (props.vitals.highlighted === false) {
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
            Pulse Rate: <span className="bold">{props.vitals.pr}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Respiratory Rate: <span className="bold">{props.vitals.rr}</span>
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
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleVisitVitalsHighlighted.bind(this, props.vitals)}/>
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
              <FontAwesomeIcon icon={faEdit} className="listIcon" onClick={props.startUpdate.bind(this, {field: 'vitals', data: props.vitals})}/>
            </OverlayTrigger>
          )}


          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
            <li>
            <Card.Text className="cardText">
              Pulse Rate: <span className="bold">{props.vitals.pr}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              Respiratory Rate: <span className="bold">{props.vitals.rr}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              Blood Pressure: <span className="bold">{props.vitals.bp1}/{props.vitals.bp2}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              Temperature: <span className="bold">{props.vitals.temp}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              SP02: <span className="bold">{props.vitals.sp02}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              Height : <span className="bold">{props.vitals.heightValue}</span>  <span className="bold">{props.vitals.heightUnit}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              Weight : <span className="bold">{props.vitals.weightValue}</span>  <span className="bold">{props.vitals.weightUnit}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              BMI : <span className="bold">{props.vitals.bmi}</span>
            </Card.Text>
            </li>
            <li>
            <Card.Text className="cardText">
              Urine
            </Card.Text>
            <Card.Text className="cardText">
              Type: <span className="bold">{props.vitals.urine.type}</span> Value: <span className="bold">{props.vitals.urine.value}</span>
            </Card.Text>
            </li>
            <li>
            {props.canDelete === true && (
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

            )}
            </li>
            {deleteState === true && (
              <li>
              <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.vitals)}>Delete</Button>
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

export default VitalsItem;
