import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './createForms.css';

const CreateVisitForm = (props) => {

return (
<div className="loginFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h1>Create Visit Form</h1>

    <Form.Row>
      <Form.Group as={Col} controlId="appointmentId">
        <Form.Label>Appointment: {props.appointment.title}</Form.Label>
        <Form.Control type="text" value={props.appointment._id}/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="title">
        <Form.Label>title</Form.Label>
        <Form.Control type="text" placeholder="title"/>
      </Form.Group>

      <Form.Group as={Col} controlId="type">
        <Form.Label>type</Form.Label>
        <Form.Control type="text" placeholder="type"/>
      </Form.Group>

      <Form.Group as={Col} controlId="subType">
        <Form.Label>subType</Form.Label>
        <Form.Control type="text" placeholder="subType"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="outline-success" type="submit" className="loginFormBtn">Create</Button>
      <Button variant="outline-danger" className="loginFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default CreateVisitForm;
