import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddExaminationForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Examination</h4>

    <Form.Row>
      <Form.Group as={Col} controlId="general">
        <Form.Label>General</Form.Label>
        <Form.Control type="text" placeholder="general"/>
      </Form.Group>
      <Form.Group as={Col} controlId="area">
        <Form.Label>Area</Form.Label>
        <Form.Control type="text" placeholder="area"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="type">
        <Form.Label>Type</Form.Label>
        <Form.Control type="text" placeholder="type"/>
      </Form.Group>
      <Form.Group as={Col} controlId="measure">
        <Form.Label>Measure</Form.Label>
        <Form.Control type="text" placeholder="measure"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="value">
        <Form.Label>Value</Form.Label>
        <Form.Control type="text" placeholder="value"/>
      </Form.Group>
      <Form.Group as={Col} controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="description"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="followUp">
        <Form.Label>FollowUp ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="attachment">
        <Form.Label>Attachment</Form.Label>
        <Form.Control type="text" placeholder="attachment"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddExaminationForm;
