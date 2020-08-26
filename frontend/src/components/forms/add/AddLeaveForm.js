import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddLeaveForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Leave</h4>

    <Form.Row>
      <Form.Group as={Col} controlId="startDate">
        <Form.Label className="formLabel">Start Date</Form.Label>
        <Form.Control type="date" placeholder="startDate"/>
      </Form.Group>

      <Form.Group as={Col} controlId="endDate">
        <Form.Label className="formLabel">End Date</Form.Label>
        <Form.Control type="date" placeholder="endDate"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="type">
        <Form.Label className="formLabel">Type</Form.Label>
        <Form.Control type="text" placeholder="type"/>
      </Form.Group>

      <Form.Group as={Col} controlId="description">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddLeaveForm;
