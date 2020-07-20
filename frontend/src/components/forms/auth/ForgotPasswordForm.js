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

<Form.Row>
<Form.Group as={Col} controlId="formGridUsername">
  <Form.Label>Username</Form.Label>
  <Form.Control type="text" placeholder="Enter username"/>
</Form.Group>

</Form.Row>

<Form.Row>
<Form.Group as={Col} controlId="formGridEmail">
  <Form.Label>Email</Form.Label>
  <Form.Control type="email" placeholder="Enter email"/>
</Form.Group>

</Form.Row>

<Form.Row>
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>

  <Button variant="primary" className="formButton" type="submit">
  Submit
  </Button>

<p>{props.successText}</p>
</Form.Row>


</Form>
</div>

)};

export default ForgotPasswordForm;
