import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddTreatmentForm = (props) => {

  let placeHolders = {
    title: '...',
    type: '...',
    description: '...',
    dose: '...',
    frequency: '...',
  }
  if (props.previousTreatment) {
    placeHolders = {
      title: props.previousTreatment.title,
      type: props.previousTreatment.type,
      description: props.previousTreatment.description,
      dose: props.previousTreatment.dose,
      frequency: props.previousTreatment.frequency,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    {props.previousTreatment && (
      <h4>Update Treatment</h4>
    )}
    {!props.previousTreatment && (
      <h4>Add Treatment</h4>
    )}
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="title" className="formGroup">
        <Form.Label className="formLabel">Treatment * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.title}/>
      </Form.Group>
    </Form.Row>

    {
      // <Form.Row className="formRow">
      //   <Form.Group as={Col} controlId="type" className="formGroup">
      //     <Form.Label className="formLabel">Type * </Form.Label>
      //     <Form.Control type="text" placeholder="..."/>
      //   </Form.Group>
      // </Form.Row>
    }

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description * </Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="dose" className="formGroup">
        <Form.Label className="formLabel">Dose (medication) * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.dose}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="frequency" className="formGroup">
        <Form.Label className="formLabel">Frequency * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.frequency}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">Attachment</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="..." onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousTreatment && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousTreatment && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddTreatmentForm;
