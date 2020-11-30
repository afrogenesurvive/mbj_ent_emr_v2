import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './authForms.css';

const LoginForm = (props) => {

return (
<div className="loginFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h1>Login</h1>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="username" className="formGroup">
        <Form.Label className="formLabel">Username</Form.Label>
        <Form.Control type="username" placeholder="username"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="password" className="formGroup">
        <Form.Label className="formLabel">Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="searchBtn loginFormBtn">Login</Button>
      <Button variant="primary" className="searchBtn " onClick={props.onStartVerification}>Verify</Button>
      <Button variant="secondary" className="searchBtn loginFormBtn" onClick={props.onStartForgotPassword}>ForgotPassword</Button>
      <Button variant="warning" className="searchBtn loginFormBtn">
        <NavLink to="/signup">Signup</NavLink>
      </Button>
    </Form.Row>
  </Form>
</div>

)};

export default LoginForm;
