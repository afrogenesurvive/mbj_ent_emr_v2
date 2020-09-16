import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddNextOfKinForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Next of Kin</h4>
    <p>Required fields are denoted by a ' * '</p>
    <Form.Row>
      <Form.Group as={Col} controlId="name">
        <Form.Label className="formLabel">Name * </Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="relation">
        <Form.Label className="formLabel">Relation (select) * </Form.Label>
        <Form.Control as="select">
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

    <Form.Row>
    <Form.Group as={Col} controlId="email">
      <Form.Label className="formLabel">Email</Form.Label>
      <Form.Control type="email" placeholder=""/>
    </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="phone">
        <Form.Label className="formLabel">Phone * </Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="phone2">
        <Form.Label className="formLabel">Phone #2</Form.Label>
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

export default AddNextOfKinForm;
