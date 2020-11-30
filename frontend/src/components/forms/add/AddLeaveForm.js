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
    <p>required feilds are denoted by a ' * '</p>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="startDate" className="formGroup">
        <Form.Label className="formLabel">Start Date * </Form.Label>
        <Form.Control type="date" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="endDate" className="formGroup">
        <Form.Label className="formLabel">End Date * </Form.Label>
        <Form.Control type="date" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="type" className="formGroup">
        <Form.Label className="formLabel">Type * </Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddLeaveForm;
