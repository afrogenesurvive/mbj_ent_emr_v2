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
    <h1>Create New</h1>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="patientId" className="formGroup">
        <Form.Label className="formLabel">Patient: {props.patient.username}</Form.Label>
        <Form.Control type="text" value={props.patient._id}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">

      {
        // <Form.Group as={Col} controlId="title">
        //   <Form.Label className="formLabel">Title</Form.Label>
        //   <Form.Control type="text" placeholder="title"/>
        // </Form.Group>

        // <Form.Group as={Col} controlId="subType">
        //   <Form.Label className="formLabel">Sub-type</Form.Label>
        //   <Form.Control type="text" placeholder="subType"/>
        // </Form.Group>
      }

      <Form.Group as={Col} controlId="type" className="formGroup">
        <Form.Label className="formLabel">Type</Form.Label>
        <Form.Control as="select">
          <option>new_unreferred</option>
          <option>referral</option>
          <option>follow_up</option>
        </Form.Control>
      </Form.Group>

    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="important" className="formGroup">
        <Form.Label className="formLabel">Important ?</Form.Label>
        <Form.Control type="checkbox"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      { !props.preFillDate && (
        <Form.Group as={Col} controlId="date" className="formGroup">
          <Form.Label className="formLabel">Date</Form.Label>
          <Form.Control type="date" placeholder="..."/>
        </Form.Group>
      )}

      { props.preFillDate && (
        <Form.Group as={Col} controlId="date" className="formGroup">
          <Form.Label className="formLabel">Date</Form.Label>
          <Form.Control type="date" placeholder="..." value={props.preFillDate}/>
        </Form.Group>
      )}

    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="time" className="formGroup">
        <Form.Label className="formLabel">Time</Form.Label>
        <Form.Control type="time" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="location" className="formGroup">
        <Form.Label className="formLabel">Location</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="loginFormBtn searchBtn">Create</Button>
      <Button variant="danger" className="loginFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default CreateAppointmentForm;
