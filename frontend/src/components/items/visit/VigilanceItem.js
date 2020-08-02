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
              <h3>chronicIllness:</h3>
              <p>Diabetes</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.diabetes.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.diabetes.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.diabetes.comment}</span>
              </Card.Text>

              <p>High BloodPressure</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.hbp.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.hbp.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.hbp.comment}</span>
              </Card.Text>

              <p>Dyslipidemia</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.dyslipidemia.comment}</span>
              </Card.Text>

              <p>Cad</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.chronicIllness.cad.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.chronicIllness.cad.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.chronicIllness.cad.comment}</span>
              </Card.Text>

              <h3>lifestyle</h3>
              <p>Weight</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.weight.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.weight.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.weight.comment}</span>
              </Card.Text>

              <p>Diet</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.diet.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.diet.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.diet.comment}</span>
              </Card.Text>

              <p>Smoking</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.smoking.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.smoking.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.smoking.comment}</span>
              </Card.Text>

              <p>SubstanceAbuse</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.substanceAbuse.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.substanceAbuse.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.substanceAbuse.comment}</span>
              </Card.Text>

              <p>exercise</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.exercise.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.exercise.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.exercise.comment}</span>
              </Card.Text>

              <p>allergies</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.allergies.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.allergies.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.allergies.comment}</span>
              </Card.Text>

              <p>asthma</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.lifestyle.asthma.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.lifestyle.asthma.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.lifestyle.asthma.comment}</span>
              </Card.Text>

              <h3>Screening</h3>
              <p>breast</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.breast.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.breast.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.breast.comment}</span>
              </Card.Text>

              <p>prostate</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.prostate.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.prostate.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.prostate.comment}</span>
              </Card.Text>

              <p>cervix</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.cervix.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.cervix.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.cervix.comment}</span>
              </Card.Text>

              <p>colon</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.colon.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.colon.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.colon.comment}</span>
              </Card.Text>

              <p>dental</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.screening.dental.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.screening.dental.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.screening.dental.comment}</span>
              </Card.Text>

              <h3>Vaccines</h3>
              <p>Influenza</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.influenza.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.influenza.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.influenza.comment}</span>
              </Card.Text>

              <p>varicella</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.varicella.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.varicella.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.varicella.comment}</span>
              </Card.Text>

              <p>hpv</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.hpv.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.hpv.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.hpv.comment}</span>
              </Card.Text>

              <p>mmr</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.mmr.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.mmr.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.mmr.comment}</span>
              </Card.Text>

              <p>tetanus</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.tetanus.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.tetanus.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.tetanus.comment}</span>
              </Card.Text>

              <p>pneumovax</p>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.pneumovax.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.pneumovax.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.pneumovax.comment}</span>
              </Card.Text>

              <p>other</p>
              <Card.Text className="cardText">
                Other: <span className="bold">{props.vigilance.vaccines.other.name}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Medication: <span className="bold">{props.vigilance.vaccines.other.medication}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Testing: <span className="bold">{props.vigilance.vaccines.other.testing}</span>
              </Card.Text>
              <Card.Text className="cardText">
                Comment: <span className="bold">{props.vigilance.vaccines.other.comment}</span>
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
