import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './createForms.css';

const CreateAppointmentForm = (props) => {

return (
<div className="loginFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h1>Create Appointment Form</h1>

    <Form.Row>
      <Form.Group as={Col} controlId="patientId">
        <Form.Label className="formLabel">Patient: {props.patient.username}</Form.Label>
        <Form.Control type="text" value={props.patient._id}/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="title">
        <Form.Label className="formLabel">Title</Form.Label>
        <Form.Control type="text" placeholder="title"/>
      </Form.Group>

      <Form.Group as={Col} controlId="type">
        <Form.Label className="formLabel">Type</Form.Label>
        <Form.Control as="select">
          <option>new_unreferred</option>
          <option>referral</option>
          <option>follow_up</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="subType">
        <Form.Label className="formLabel">Sub-type</Form.Label>
        <Form.Control type="text" placeholder="subType"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="date">
        <Form.Label className="formLabel">Date</Form.Label>
        <Form.Control type="date" placeholder="YYYY-MM-DD"/>
      </Form.Group>

      <Form.Group as={Col} controlId="time">
        <Form.Label className="formLabel">Time</Form.Label>
        <Form.Control type="time" placeholder="time"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="location">
        <Form.Label className="formLabel">Location</Form.Label>
        <Form.Control type="text" placeholder="location"/>
      </Form.Group>

      <Form.Group as={Col} controlId="description">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="description"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="important">
        <Form.Label className="formLabel">Important</Form.Label>
        <Form.Control type="checkbox" />
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="success" type="submit" className="loginFormBtn">Create</Button>
      <Button variant="danger" className="loginFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default CreateAppointmentForm;
