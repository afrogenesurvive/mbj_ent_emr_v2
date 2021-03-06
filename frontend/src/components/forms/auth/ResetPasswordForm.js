import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { NavLink } from 'react-router-dom';
import './CreateUserForm.css';

const ResetPasswordForm = (props) => {

return (
<div className="UpdateFormContainer">

<Form onSubmit={props.onConfirm}>
  <h1>Reset Password</h1>
  <Form.Row className="formRow">
    <Form.Group as={Col} controlId="verificationCode" className="formGroup">
      <Form.Label className="formLabel">verification Code</Form.Label>
      <Form.Control type="text" value={props.verf}/>
    </Form.Group>
  </Form.Row>
  <Form.Row className="formRow">
    <Form.Group as={Col} controlId="password" className="formGroup">
    <Form.Label className="formLabel">Password</Form.Label>
    <Form.Control type="password" placeholder="..."/>
  </Form.Group>
  </Form.Row>

  <Form.Row className="formBtnRow">
    <Button variant="primary" className="formButton" type="submit">
    Reset
    </Button>
    <Button variant="danger" className="formButton" onClick={props.onCancel}>
      <NavLink to="/landing">Cancel</NavLink>
    </Button>
  </Form.Row>
</Form>

</div>

)};

export default ResetPasswordForm;
