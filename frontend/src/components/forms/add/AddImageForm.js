import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddImageForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Image</h4>

    <Form.Row>
      <Form.Group as={Col} controlId="name">
        <Form.Label>name</Form.Label>
        <Form.Control type="text" placeholder="name"/>
      </Form.Group>
      <Form.Group as={Col} controlId="type">
        <Form.Label>type</Form.Label>
        <Form.Control type="text" placeholder="type"/>
      </Form.Group>
      <Form.Group as={Col} controlId="path">
        <Form.Label>path</Form.Label>
        <Form.Control path="text" placeholder="path"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddImageForm;
