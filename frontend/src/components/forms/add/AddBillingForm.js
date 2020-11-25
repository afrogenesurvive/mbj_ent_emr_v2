import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddBillingForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Billing</h4>
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="type" className="formGroup">
        <Form.Label className="formLabel">Type * </Form.Label>
        <Form.Control type="text" placeholder="type"/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description * </Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="description"/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="amount" className="formGroup">
        <Form.Label className="formLabel">Amount * </Form.Label>
        <Form.Control type="number" step="0.001" placeholder="amount"/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="paid" className="formGroup">
        <Form.Label className="formLabel">Paid ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="notes" className="formGroup">
        <Form.Label className="formLabel">Notes</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="notes"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">File</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="File" onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddBillingForm;
