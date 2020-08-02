import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddInvestigationForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Investigation</h4>

    <Form.Row>
      <Form.Group as={Col} controlId="title">
        <Form.Label>title</Form.Label>
        <Form.Control type="text" placeholder="title"/>
      </Form.Group>
      <Form.Group as={Col} controlId="type">
        <Form.Label>type</Form.Label>
        <Form.Control type="text" placeholder="type"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="description">
        <Form.Label>description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="description"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="attachment">
        <Form.Label>attachment</Form.Label>
        <Form.Control path="text" placeholder="attachment"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddInvestigationForm;
