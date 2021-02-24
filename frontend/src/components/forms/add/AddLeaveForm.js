import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddLeaveForm = (props) => {

  let placeHolders = {
    startDate: '...',
    endDate: '...',
    type: '...',
    description: '...',
  }
  if (props.previousLeave) {
    placeHolders = {
      startDate: props.previousLeave.startDate,
      endDate: props.previousLeave.endDate,
      type: props.previousLeave.type,
      description: props.previousLeave.description,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
  {props.previousLeave && (
    <h4>Update Leave</h4>
  )}
  {!props.previousLeave && (
    <h4>Add Leave</h4>
  )}
    <p>required feilds are denoted by a ' * '</p>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="startDate" className="formGroup">
        <Form.Label className="formLabel">Start Date * </Form.Label>
        <Form.Control type="date" placeholder={placeHolders.startDate}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="endDate" className="formGroup">
        <Form.Label className="formLabel">End Date * </Form.Label>
        <Form.Control type="date" placeholder={placeHolders.endDate}/>
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
    </Form.Row>

    <Form.Row className="formBtnRow">
      {props.previousLeave && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousLeave && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddLeaveForm;
