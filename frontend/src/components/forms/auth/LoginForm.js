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
    <Form.Row>
      <Form.Group as={Col} controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="username" placeholder="Enter username"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="outline-success" type="submit" className="loginFormBtn">Login</Button>
      <Button variant="outline-primary" onClick={props.onStartVerification}>Verify</Button>
      <Button variant="outline-secondary" className="loginFormBtn" onClick={props.onStartForgotPassword}>ForgotPassword</Button>
      <Button variant="outline-warning" className="loginFormBtn">
        <NavLink to="/signup">Signup</NavLink>
      </Button>
    </Form.Row>
  </Form>
</div>

)};

export default LoginForm;
