import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faFolderMinus,
  faEye,
  faEraser,
  faTrashAlt,
  faBan,
  faCheckSquare,
  faExternalLinkAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const AddVitalsForm = (props) => {

  let initialWeightUnit;

  let placeHolders = {
    pr: 0,
    bp1: 0,
    bp2: 0,
    rr: 0,
    temp: 0,
    sp02: 0,
    heightUnit: '...',
    heightValue: 0,
    weightUnit: '...',
    weightValue: 0,
    urineType: '...',
    urineValue: '...',
  }
  if (props.previousVitals) {
    placeHolders = {
      pr: props.previousVitals.pr,
      bp1: props.previousVitals.bp1,
      bp2: props.previousVitals.bp2,
      rr: props.previousVitals.rr,
      temp: props.previousVitals.temp,
      sp02: props.previousVitals.sp02,
      heightUnit: props.previousVitals.heightUnit,
      heightValue: props.previousVitals.heightValue,
      weightUnit: props.previousVitals.weightUnit,
      weightValue: props.previousVitals.weightValue,
      urineType: props.previousVitals.urine.type,
      urineValue: props.previousVitals.urine.value,
    }

    if (placeHolders.heightUnit === 'In') {
      initialWeightUnit = 'Lbs'
    } else if (placeHolders.heightUnit === 'M') {
      initialWeightUnit = 'Kg'
    }
  }

  const [weightUnit, setState] = useState(initialWeightUnit);
  const handleStateChange = (args) => {
    // setState(args)
    if (args === 'M') {
      setState('Kg');
    }
    if (args === 'In') {
      setState('Lbs');
    }
   }


return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
  {props.previousVitals && (
    <h4>Update Vitals</h4>
  )}
  {!props.previousVitals && (
    <h4>Add Vitals</h4>
  )}

    <p>required feilds are denoted by a ' * '</p>

    <div className="formDivider1">
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="pr" className="formGroup">
        <Form.Label className="formLabel">Pulse Rate * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder={placeHolders.pr}/>
      </Form.Group>

      <Form.Group as={Col} controlId="rr" className="formGroup">
        <Form.Label className="formLabel">Respiratory Rate * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder={placeHolders.rr}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="bp1" className="formGroup">
        <Form.Label className="formLabel">Blood Pressure (top) * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder={placeHolders.bp1}/>
      </Form.Group>
      <Form.Group as={Col} controlId="bp2" className="formGroup">
        <Form.Label className="formLabel">Blood Pressure (bottom) * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder={placeHolders.bp2}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
    <Form.Group as={Col} controlId="temp" className="formGroup">
      <Form.Label className="formLabel">Temperature * </Form.Label>
      <Form.Control type="number" step='0.001' placeholder={placeHolders.temp}/>
    </Form.Group>

    <Form.Group as={Col} controlId="sp02" className="formGroup">
      <Form.Label className="formLabel">SP-02 * </Form.Label>
      <Form.Control type="number" step='0.001' placeholder={placeHolders.sp02}/>
    </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider2">
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="heightUnit" className="formGroup">
        <Form.Label className="formLabel">Height: Unit * </Form.Label>
        <Form.Control as="select" onChange={e => handleStateChange(e.target.value)}>
          <option>{placeHolders.heightUnit}</option>
          <option>In</option>
          <option>M</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="heightValue" className="formGroup">
        <Form.Label className="formLabel">Height: Value * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder={placeHolders.heightValue}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="weightUnit" className="formGroup">
        <Form.Label className="formLabel">Weight: Unit * </Form.Label>
        <Form.Control type="text" value={weightUnit}/>
      </Form.Group>
      <Form.Group as={Col} controlId="weightValue" className="formGroup">
        <Form.Label className="formLabel">Weight: Value * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder={placeHolders.weightValue}/>
      </Form.Group>
    </Form.Row>
    {
      // <Form.Row>
      //   <Form.Group as={Col} controlId="bmi">
      //     <Form.Label>BMI</Form.Label>
      //     <Form.Control type="number" step='0.001' placeholder="bmi"/>
      //   </Form.Group>
      // </Form.Row>
    }

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="urineType" className="formGroup">
        <Form.Label className="formLabel">Urine: Type</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.urineType}/>
      </Form.Group>
      <Form.Group as={Col} controlId="urineValue" className="formGroup">
        <Form.Label className="formLabel">Urine: Value</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.urineValue}/>
      </Form.Group>
    </Form.Row>
    </div>

    <Form.Row className="formBtnRow">

      {props.previousVitals && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousVitals && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddVitalsForm;
