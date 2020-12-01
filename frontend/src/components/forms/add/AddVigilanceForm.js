import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddVigilanceForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h3>Add Vigilance</h3>

    <div className="formDivider1">
    <h4>Chronic Illness:</h4>
    <p className="underlined">Diabetes</p>
    <Form.Row>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDiabetesMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDiabetesTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDiabetesComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">HBP</p>
    <Form.Row>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessHbpMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessHbpTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessHbpComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Dyslipidemia</p>
    <Form.Row>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDyslipidemiaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDyslipidemiaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessDyslipidemiaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Cad</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceChronicIllnessCadMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessCadTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceChronicIllnessCadComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider2">
    <h4>Lifestyle:</h4>
    <p className="underlined">Weight</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleWeightMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleWeightTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleWeightComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Diet</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleDietMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleDietTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleDietComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Smoking</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleSmokingMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSmokingTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSmokingComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">SubstanceAbuse</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleSubstanceAbuseMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSubstanceAbuseTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleSubstanceAbuseComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Exercise</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleExerciseMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleExerciseTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleExerciseComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Allergies</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleAllergiesMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAllergiesTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAllergiesComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Asthma</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceLifestyleAsthmaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAsthmaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceLifestyleAsthmaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider3">
    <h4>Screening:</h4>
    <p className="underlined">Breast</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningBreastMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningBreastTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningBreastComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Prostate</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningProstateMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningProstateTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningProstateComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Cervix</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningCervixMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningCervixTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningCervixComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Colon</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningColonMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningColonTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningColonComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Dental</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceScreeningDentalMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningDentalTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceScreeningDentalComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider1">
    <h4>Vaccines</h4>
    <p className="underlined">Influenza</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesInfluenzaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesInfluenzaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesInfluenzaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Varicella</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesVaricellaMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesVaricellaTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesVaricellaComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Hpv</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesHpvMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesHpvTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesHpvComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Mmr</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesMmrMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesMmrTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesMmrComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Tetanus</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesTetanusMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesTetanusTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesTetanusComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Pneumovax</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesPneumovaxMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesPneumovaxTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesPneumovaxComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <p className="underlined">Other</p>
    <Form.Row>
      <Form.Group as={Col} controlId="vigilanceVaccinesOtherName">
        <Form.Label className="formLabel">Name</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesOtherMedication">
        <Form.Label className="formLabel">Medication ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesOtherTesting">
        <Form.Label className="formLabel">Testing ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>

      <Form.Group as={Col} controlId="vigilanceVaccinesOtherComment">
        <Form.Label className="formLabel">Comment</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>
    </div>


    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddVigilanceForm;
