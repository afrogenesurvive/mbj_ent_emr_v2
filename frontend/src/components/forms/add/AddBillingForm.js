import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddBillingForm = (props) => {

  let placeHolders = {
    title: '...',
    type: '...',
    description: '...',
    amount: 0,
    paid: false,
    notes: '...',
  }
  if (props.previousBilling) {
    placeHolders = {
      title: props.previousBilling.title,
      type: props.previousBilling.type,
      description: props.previousBilling.description,
      amount: props.previousBilling.amount,
      paid: props.previousBilling.paid,
      notes: props.previousBilling.notes,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    {props.previousBilling && (
      <h4>Update Billing</h4>
    )}
    {!props.previousBilling && (
      <h4>Add Billing</h4>
    )}
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="type" className="formGroup">
        <Form.Label className="formLabel">Type * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.type}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description * </Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="amount" className="formGroup">
        <Form.Label className="formLabel">Amount * </Form.Label>
        <Form.Control type="number" step="0.001" placeholder={placeHolders.amount}/>
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
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.notes}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">File</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="..." onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousBilling && (
        <Button variant="outline-success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousBilling && (
        <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="outline-danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddBillingForm;
