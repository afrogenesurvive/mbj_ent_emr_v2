import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './searchForms.css';

const UserSearchForm = (props) => {

return (
<div className="searchFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="field" className="formGroup">
        <Form.Label className="formLabel">Search Field</Form.Label>
        <Form.Control as="select">
          <option>title</option>
          <option>name</option>
          <option>username</option>
          <option>registrationNumber</option>
          <option>dob</option>
          <option>age</option>
          <option>gender</option>
          <option>contact.email</option>
          <option>contact.phone</option>
          <option>contact.phone2</option>
          <option>addresses.number</option>
          <option>addresses.street</option>
          <option>addresses.town</option>
          <option>addresses.city</option>
          <option>addresses.parish</option>
          <option>addresses.country</option>
          <option>addresses.postalCode</option>
          <option>addresses.primary</option>
          <option>loggedIn</option>
          <option>clientConnected</option>
          <option>verification.verified</option>
          <option>attendance.date</option>
          <option>attendance.status</option>
          <option>attendance.description</option>
          <option>leave.type</option>
          <option>leave.startDate</option>
          <option>leave.endDate</option>
          <option>leave.description</option>
          <option>images.name</option>
          <option>images.type</option>
          <option>images.path</option>
          <option>files.name</option>
          <option>files.type</option>
          <option>files.path</option>
          <option>notes</option>
        </Form.Control>
      </Form.Group>


    </Form.Row>

    <Form.Row className="formRow">
    <Form.Group as={Col} controlId="query" className="formGroup">
      <Form.Label className="formLabel">Search Query</Form.Label>
      <Form.Control type="text" placeholder="YYYY-MM-DD"/>
    </Form.Group>

    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="filterFormBtn searchBtn">Search</Button>
      <Button variant="danger" className="filterFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default UserSearchForm;
