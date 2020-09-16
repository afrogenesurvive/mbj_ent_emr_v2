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

  const [weightUnit, setState] = useState('Lbs');
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
    <h4>Add Vitals</h4>
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row>
      <Form.Group as={Col} controlId="pr">
        <Form.Label className="formLabel">Pulse Rate * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="bp1">
        <Form.Label className="formLabel">Blood Pressure (top) * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="bp2">
        <Form.Label className="formLabel">Blood Pressure (bottom) * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="rr">
        <Form.Label className="formLabel">Respiratory Rate * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="temp">
        <Form.Label className="formLabel">Temperature * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="ps02">
        <Form.Label className="formLabel">PS-02 * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="heightUnit">
        <Form.Label className="formLabel">Height: Unit * </Form.Label>
        <Form.Control as="select" onChange={e => handleStateChange(e.target.value)}>
          <option>In</option>
          <option>M</option>
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col} controlId="heightValue">
        <Form.Label className="formLabel">Height: Value * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="weightUnit">
        <Form.Label className="formLabel">Weight: Unit * </Form.Label>
        <Form.Control type="text" value={weightUnit}/>
      </Form.Group>
      <Form.Group as={Col} controlId="weightValue">
        <Form.Label className="formLabel">Weight: Value * </Form.Label>
        <Form.Control type="number" step='0.001' placeholder=""/>
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

    <Form.Row>
      <Form.Group as={Col} controlId="urineType">
        <Form.Label className="formLabel">Urine: Type</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="urineValue">
        <Form.Label className="formLabel">Urine: Value</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddVitalsForm;
