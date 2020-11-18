import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddAllergyForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Allergy</h4>
    <p>Required fields are denoted by a ' * '</p>

    <Form.Row>
      <Form.Group as={Col} controlId="title">
        <Form.Label className="formLabel">Title</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
      <Form.Group as={Col} controlId="type">
        <Form.Label className="formLabel">Type (select) * </Form.Label>
        <Form.Control as="select">
          <option>Food</option>
          <option>Drug</option>
        </Form.Control>
      </Form.Group>

    </Form.Row>

    <Form.Row>
    <Form.Group as={Col} controlId="description">
      <Form.Label className="formLabel">Description * </Form.Label>
      <Form.Control as="textarea" rows="3" placeholder=""/>
    </Form.Group>

    <Form.Group as={Col}>
      <Form.Label className="formLabel">Attachment</Form.Label>
      <Form.Control type="file" id="fileInput" placeholder="File" onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
    </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddAllergyForm;
