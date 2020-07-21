import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './authForms.css';

const SignupForm = (props) => {

return (
<div className="loginFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h1>Signup</h1>
    <Form.Row>
      <Form.Group as={Col} controlId="email">
        <Form.Label>email Address</Form.Label>
        <Form.Control type="email" placeholder="alpha@beta.omega"/>
      </Form.Group>

      <Form.Group as={Col} controlId="password">
        <Form.Label>password</Form.Label>
        <Form.Control type="password" placeholder="password"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="role">
        <Form.Label>role</Form.Label>
        <Form.Control as="select">
          <option>Admin</option>
          <option>Staff</option>
          <option>Nurse</option>
          <option>Doctor</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="title">
        <Form.Label>title</Form.Label>
        <Form.Control as="select">
          <option>Mr</option>
          <option>Mrs</option>
          <option>Ms</option>
          <option>Dr</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="name">
        <Form.Label>name</Form.Label>
        <Form.Control type="text" placeholder="name"/>
      </Form.Group>

      <Form.Group as={Col} controlId="username">
        <Form.Label>username</Form.Label>
        <Form.Control type="text" placeholder="username"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="dob">
        <Form.Label>dob</Form.Label>
        <Form.Control type="date" placeholder="YYYY-MM-DD"/>
      </Form.Group>

      <Form.Group as={Col} controlId="gender">
        <Form.Label>gender</Form.Label>
        <Form.Control as="select">
          <option>Female</option>
          <option>Male</option>
          <option>Prefer Not to Say</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="phone">
        <Form.Label>phone</Form.Label>
        <Form.Control type="text" placeholder="+18760001234"/>
      </Form.Group>

      <Form.Group as={Col} controlId="phone2">
        <Form.Label>phone2</Form.Label>
        <Form.Control type="text" placeholder="+18760005678"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="addressNumber">
        <Form.Label>addressNumber</Form.Label>
        <Form.Control type="number" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressStreet">
        <Form.Label>addressStreet</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressTown">
        <Form.Label>addressTown</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="addressCity">
        <Form.Label>addressCity</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressParish">
        <Form.Label>addressParish</Form.Label>
        <Form.Control as="select">
          <option>none</option>
          <option>Hanover</option>
          <option>St. Elizabeth</option>
          <option>St. James</option>
          <option>Trelawny</option>
          <option>Westmoreland</option>
          <option>Clarendon</option>
          <option>Manchester</option>
          <option>St. Ann</option>
          <option>St. Catherine</option>
          <option>St. Mary</option>
          <option>Kingston</option>
          <option>St. Andrew</option>
          <option>Portland</option>
          <option>St. Thomas</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="addressCountry">
        <Form.Label>addressCountry</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressPostalCode">
        <Form.Label>addressPostalCode</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="outline-success" type="submit" className="loginFormBtn">Signup</Button>
    </Form.Row>
    <Form.Row>
      <Button variant="outline-warning" className="loginFormBtn">
        <NavLink to="/login">Login</NavLink>
      </Button>
    </Form.Row>
  </Form>
</div>

)};

export default SignupForm;
