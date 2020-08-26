import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const UpdatePatientSingleFieldForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Update Single Field</h4>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Label className="formLabel">Field</Form.Label>
        <Form.Control type="text" value={props.field}/>
      </Form.Group>

      <Form.Group as={Col} controlId="query">
        <Form.Label className="formLabel">Value</Form.Label>
        <Form.Control type="text" placeholder="new value... (Date format = YYYY-MM-DD!!)"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default UpdatePatientSingleFieldForm;
