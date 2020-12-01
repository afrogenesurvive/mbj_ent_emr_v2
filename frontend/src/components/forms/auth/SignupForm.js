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

    <div className="formDivider1">
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="email">
        <Form.Label className="formLabel">Email Address</Form.Label>
        <Form.Control type="email" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="password">
        <Form.Label className="formLabel">Password</Form.Label>
        <Form.Control type="password" placeholder="..."/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider2">
    <Form.Row className="formRow">

      {
        // <Form.Group as={Col} controlId="role">
        //   <Form.Label className="formLabel">Role</Form.Label>
        //   <Form.Control as="select">
        //     <option>Admin</option>
        //     <option>Staff</option>
        //     <option>Nurse</option>
        //     <option>Doctor</option>
        //   </Form.Control>
        // </Form.Group>
      }

      <Form.Group as={Col} controlId="role">
        <Form.Label className="formLabel">Role</Form.Label>
        <Form.Control as="select">
          <option>Staff</option>
          <option>Nurse</option>
          <option>Doctor</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="title">
        <Form.Label className="formLabel">Title</Form.Label>
        <Form.Control as="select">
          <option>Mr</option>
          <option>Mrs</option>
          <option>Ms</option>
          <option>Dr</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="name">
        <Form.Label className="formLabel">Name</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>

      <Form.Group as={Col} controlId="username">
        <Form.Label className="formLabel">Username</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="dob">
        <Form.Label className="formLabel">D.O.B</Form.Label>
        <Form.Control type="date" placeholder="..."/>
      </Form.Group>

      <Form.Group as={Col} controlId="gender">
        <Form.Label className="formLabel">Gender</Form.Label>
        <Form.Control as="select">
          <option>Female</option>
          <option>Male</option>
          <option>Prefer Not to Say</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="phone">
        <Form.Label className="formLabel">Phone</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>

      <Form.Group as={Col} controlId="phone2">
        <Form.Label className="formLabel">Phone #2</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>
    </div>

    <div className="formDivider3">
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="addressNumber">
        <Form.Label className="formLabel">Address Number</Form.Label>
        <Form.Control type="number" placeholder="..."/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressStreet">
        <Form.Label className="formLabel">Address Street</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="addressTown">
        <Form.Label className="formLabel">Address Town</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressCity">
        <Form.Label className="formLabel">Address City</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="addressParish">
        <Form.Label className="formLabel">Address Parish</Form.Label>
        <Form.Control as="select">
          <option>none</option>
          <option>Clarendon</option>
          <option>Hanover</option>
          <option>Kingston</option>
          <option>Manchester</option>
          <option>Portland</option>
          <option>St. Andrew</option>
          <option>St. Ann</option>
          <option>St. Catherine</option>
          <option>St. Elizabeth</option>
          <option>St. James</option>
          <option>St. Mary</option>
          <option>St. Thomas</option>
          <option>Trelawny</option>
          <option>Westmoreland</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="addressCountry">
        <Form.Label className="formLabel">Address Country</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="addressPostalCode">
        <Form.Label className="formLabel">Address Postalcode</Form.Label>
        <Form.Control type="text" placeholder="..."/>
      </Form.Group>
    </Form.Row>
    </div>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="loginFormBtn searchBtn">Signup</Button>
      <Button variant="warning" className="loginFormBtn searchBtn">
        <NavLink to="/login">Login</NavLink>
      </Button>
    </Form.Row>


  </Form>
</div>

)};

export default SignupForm;
