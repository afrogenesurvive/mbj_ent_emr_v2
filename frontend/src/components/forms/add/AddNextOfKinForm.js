import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddNextOfKinForm = (props) => {

  let placeHolders = {
    name: '...',
    relation: '...',
    email: '...',
    phone: '...',
    phone2: '...',
  }
  if (props.previousNextOfKin) {
    placeHolders = {
      name: props.previousNextOfKin.name,
      relation: props.previousNextOfKin.relation,
      email: props.previousNextOfKin.contact.email,
      phone: props.previousNextOfKin.contact.phone1,
      phone2: props.previousNextOfKin.contact.phone2,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    {props.previousNextOfKin && (
      <h4>Update Next of Kin</h4>
    )}
    {!props.previousNextOfKin && (
      <h4>Add Next of Kin</h4>
    )}
    <p>Required fields are denoted by a ' * '</p>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="name" className="formGroup">
        <Form.Label className="formLabel">Name * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.name}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="relation" className="formGroup">
        <Form.Label className="formLabel">Relation (select) * </Form.Label>
        <Form.Control as="select">
          <option>{placeHolders.relation}</option>
          <option>Mother</option>
          <option>Father</option>
          <option>Brother</option>
          <option>Sister</option>
          <option>Grandfather</option>
          <option>Grandmother</option>
          <option>Uncle</option>
          <option>Aunt</option>
          <option>Niece</option>
          <option>Uncle</option>
          <option>Cousin</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="email" className="formGroup">
        <Form.Label className="formLabel">Email</Form.Label>
        <Form.Control type="email" placeholder={placeHolders.email}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="phone" className="formGroup">
        <Form.Label className="formLabel">Phone * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.phone}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="phone2" className="formGroup">
        <Form.Label className="formLabel">Phone #2</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.phone2}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      {props.previousNextOfKin && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousNextOfKin && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddNextOfKinForm;
