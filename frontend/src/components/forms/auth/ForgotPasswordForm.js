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
  <Form.Row>
    <Form.Group as={Col} controlId="username">
      <Form.Label>Username</Form.Label>
      <Form.Control type="text" placeholder="username"/>
    </Form.Group>
  </Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="email">
      <Form.Label>email</Form.Label>
      <Form.Control type="email" placeholder="email"/>
    </Form.Group>
  </Form.Row>

  <Form.Row>
    <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
    <Button variant="primary" className="formButton" type="submit">Request New Password</Button>
  </Form.Row>
</Form>
</div>

)};

export default ForgotPasswordForm;
