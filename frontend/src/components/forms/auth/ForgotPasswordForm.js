import React from 'react';
// import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import "react-datepicker/dist/react-datepicker.css";
import './ForgotPasswordForm.css';

const ForgotPasswordForm = (props) => {

return (
<div className="CreateFormContainer">
<Form onSubmit={props.onConfirm}>
  <h1>Forgot Password</h1>
  <Form.Row className="formRow">
    <Form.Group as={Col} controlId="username" className="formGroup">
      <Form.Label className="formLabel">Username</Form.Label>
      <Form.Control type="text" placeholder="..."/>
    </Form.Group>
  </Form.Row>

  <Form.Row className="formRow">
    <Form.Group as={Col} controlId="email" className="formGroup">
      <Form.Label className="formLabel">Email</Form.Label>
      <Form.Control type="email" placeholder="..."/>
    </Form.Group>
  </Form.Row>

  <Form.Row className="formBtnRow">
    <Button variant="danger" className="formButton searchBtn" onClick={props.onCancel}>Cancel</Button>
    <Button variant="primary" className="formButton searchBtn" type="submit">Request New Password</Button>
  </Form.Row>
</Form>
</div>

)};

export default ForgotPasswordForm;
