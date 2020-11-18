import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './filterForms.css';

const FilterPatientForm = (props) => {

return (
<div className="filterFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Control type="text" hidden='true' value="patient"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="key">
        <Form.Label className="formLabel">Field to Filter</Form.Label>
        <Form.Control as="select">
          <option>active</option>
          <option>name</option>
          <option>username</option>
          <option>title</option>
          <option>role</option>
          <option>dob</option>
          <option>age</option>
          <option>gender</option>
          <option>registration.date</option>
          <option>registration.number</option>
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
          <option>verification.verified</option>
          <option>expiryDate</option>
          <option>loggedIn</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="value">
        <Form.Label className="formLabel">Filter Type</Form.Label>
        <Form.Control as="select">
          <option>Ascending</option>
          <option>Descending</option>
          <option>true</option>
          <option>false</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="success" type="submit" className="filterFormBtn searchBtn">Filter</Button>
      <Button variant="danger" className="filterFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default FilterPatientForm;
