import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddInvestigationForm = (props) => {

  let placeHolders = {
    title: '...',
    type: '...',
    description: '...',
  }
  if (props.previousInvestigation) {
    placeHolders = {
      title: props.previousInvestigation.title,
      type: props.previousInvestigation.type,
      description: props.previousInvestigation.description,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    {props.previousInvestigation && (
      <h4>Update Investigation</h4>
    )}
    {!props.previousInvestigation && (
      <h4>Add Investigation</h4>
    )}
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="type" className="formGroup">
        <Form.Label className="formLabel">Type * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.type}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description * </Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">File</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="..." onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousInvestigation && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousInvestigation && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddInvestigationForm;
