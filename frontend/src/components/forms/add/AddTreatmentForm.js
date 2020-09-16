import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddTreatmentForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Treatment</h4>
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row>
      <Form.Group as={Col} controlId="title">
        <Form.Label className="formLabel">Title * </Form.Label>
        <Form.Control type="text" placeholder="title"/>
      </Form.Group>
      <Form.Group as={Col} controlId="type">
        <Form.Label className="formLabel">Type * </Form.Label>
        <Form.Control type="text" placeholder="type"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="description">
        <Form.Label className="formLabel">Description * </Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="description"/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="dose">
        <Form.Label className="formLabel">Dose * </Form.Label>
        <Form.Control type="text" placeholder="dose"/>
      </Form.Group>
      <Form.Group as={Col} controlId="frequency">
        <Form.Label className="formLabel">Frequency * </Form.Label>
        <Form.Control type="text" placeholder="frequency"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label className="formLabel">Attachment</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="File" onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddTreatmentForm;
