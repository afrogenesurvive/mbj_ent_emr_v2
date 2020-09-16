import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddExaminationForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Examination</h4>
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row>
      <Form.Group as={Col} controlId="general">
        <Form.Label className="formLabel">General * </Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="area">
        <Form.Label className="formLabel">Area * </Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="type">
        <Form.Label className="formLabel">Type * </Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="measure">
        <Form.Label className="formLabel">Measure * </Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>
    <Form.Row>
      <Form.Group as={Col} controlId="value">
        <Form.Label className="formLabel">Value * </Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="description">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="followUp">
        <Form.Label className="formLabel">FollowUp ?</Form.Label>
        <Form.Control type="checkbox" onChange={(e) => {console.log(e.target.checked)}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label className="formLabel">File</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="" onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddExaminationForm;
