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
    <Form.Group controlId="email">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email"/>
      <Form.Text className="text-muted">
        User Login
      </Form.Text>
    </Form.Group>
    <Form.Group controlId="password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" />
    </Form.Group>
    <Button variant="outline-success" type="submit" className="loginFormBtn">
      Login
    </Button>
    <Button variant="outline-warning" className="loginFormBtn">
      <NavLink to="/signup">Signup</NavLink>
    </Button>
    <Button variant="outline-secondary" className="loginFormBtn">
      ForgotPassword
    </Button>
  </Form>
</div>

)};

export default LoginForm;
