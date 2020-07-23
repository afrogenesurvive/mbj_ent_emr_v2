import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const UpdateSingleFieldForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Update Single Field</h4>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Label>field</Form.Label>
        <Form.Control type="text" value={props.field}/>
      </Form.Group>

      <Form.Group as={Col} controlId="query">
        <Form.Label>query</Form.Label>
        <Form.Control type="text" placeholder="query... date = YYY-MM-DD!!"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default UpdateSingleFieldForm;
