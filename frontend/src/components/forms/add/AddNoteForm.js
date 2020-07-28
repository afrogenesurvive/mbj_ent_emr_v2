import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddNoteForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Notes</h4>

    <Form.Row>
      <Form.Group as={Col} controlId="notes">
        <Form.Label>notes</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="note,note,note,note"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddNoteForm;
