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

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="appointmentId" className="formGroup">
        <Form.Label className="formLabel">Appointment: {props.appointment.title}</Form.Label>
        <Form.Control type="text" value={props.appointment._id}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
    {
      // <Form.Group as={Col} controlId="title">
      //   <Form.Label className="formLabel">Title</Form.Label>
      //   <Form.Control type="text" placeholder="title"/>
      // </Form.Group>
    }

      <Form.Group as={Col} controlId="type" className="formGroup">
        <Form.Label className="formLabel">Type</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>

    </Form.Row>

    <Form.Row className="formRow">
      <Button variant="success" type="submit" className="loginFormBtn">Create</Button>
      <Button variant="danger" className="loginFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default CreateVisitForm;
