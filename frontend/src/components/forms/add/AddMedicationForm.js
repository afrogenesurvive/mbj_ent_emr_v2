import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddMedicationForm = (props) => {

  let placeHolders = {
    title: '....',
    type: '....',
    dosage: '....',
    description: '....',
  }
  if (props.previousMedication) {
    placeHolders = {
      title: props.previousMedication.title,
      type: props.previousMedication.type,
      dosage: props.previousMedication.dosage,
      description: props.previousMedication.description,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    {props.previousMedication && (
      <h4>Update Medication</h4>
    )}
    {!props.previousMedication && (
      <h4>Add Medication</h4>
    )}
    <p>Required fields are denoted by a ' * '</p>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="title" className="formGroup">
        <Form.Label className="formLabel">Name * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.title}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="type" className="formGroup">
        <Form.Label className="formLabel">Type * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.type}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
      </Form.Group>

      <Form.Group as={Col} controlId="dosage" className="formGroup">
        <Form.Label className="formLabel">Dosage</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.dosage}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">Attachment</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="..." onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousMedication && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousMedication && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddMedicationForm;
