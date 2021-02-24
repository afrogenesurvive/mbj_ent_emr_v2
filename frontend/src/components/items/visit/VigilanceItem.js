import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
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

const VigilanceItem = (props) => {

  let liClass;
  if (props.vigilance.highlighted === false) {
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
            #: <span className="bold">{props.count}</span>
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


          <OverlayTrigger
            key={'top'}
            placement={'top'}
            overlay={
              <Popover id={`popover-positioned-${'top'}`}>
                <Popover.Content>
                  <strong>Toggle Highlight</strong>
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleVisitVigilanceHighlighted.bind(this, props.vigilance)}/>
          </OverlayTrigger>

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <h5>chronicIllness:</h5>
              </li>
              <li>
              <p>Diabetes</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.diabetes.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.diabetes.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.diabetes.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>High BloodPressure</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.hbp.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.hbp.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.hbp.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Dyslipidemia</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Cad</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.cad.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.cad.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.cad.comment}</span>
              </Card.Text>
              </li>
              <li>
              <h5>Lifestyle</h5>
              </li>
              <li>
              <p>Weight</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.weight.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.weight.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.weight.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Diet</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.diet.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.diet.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.diet.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Smoking</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.smoking.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.smoking.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.smoking.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>SubstanceAbuse</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.substanceAbuse.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.substanceAbuse.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.substanceAbuse.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Exercise</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.exercise.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.exercise.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.exercise.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Allergies</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.allergies.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.allergies.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.allergies.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Asthma</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.asthma.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.asthma.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.asthma.comment}</span>
              </Card.Text>
              </li>
              <li>
              <h5>Screening :</h5>
              </li>
              <li>
              <p>Breast</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.breast.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.breast.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.breast.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Prostate</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.prostate.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.prostate.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.prostate.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Cervix</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.cervix.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.cervix.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.cervix.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Colon</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.colon.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.colon.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.colon.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Dental</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.dental.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.dental.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.dental.comment}</span>
              </Card.Text>
              </li>
              <li>
              <h5>Vaccines :</h5>
              </li>
              <li>
              <p>Influenza</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.influenza.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.influenza.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.influenza.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Varicella</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.varicella.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.varicella.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.varicella.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>HPV</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.hpv.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.hpv.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.hpv.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>MMR</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.mmr.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.mmr.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.mmr.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Tetanus</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.tetanus.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.tetanus.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.tetanus.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Pneumovax</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.pneumovax.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.pneumovax.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.pneumovax.comment}</span>
              </Card.Text>
              </li>
              <li>
              <p>Other</p>
              </li>
              <li>
              <Card.Text className="cardText">
                Other: <span className="bold">{props.vigilance.vaccines.other.name}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.other.medication.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.other.testing.toString()}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.other.comment}</span>
              </Card.Text>
              </li>
              {props.canDelete === true && (
                <li>
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
                </li>
              )}
              {deleteState === true && (
                <li>
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.vigilance)}>Delete</Button>
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

export default VigilanceItem;
