import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddFileForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add File</h4>

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

    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>File</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="File" onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddFileForm;
