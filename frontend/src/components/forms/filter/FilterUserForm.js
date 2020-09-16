import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './filterForms.css';

const FilterUserForm = (props) => {

return (
<div className="filterFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Control type="text" hidden='true' value="staff"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="key">
        <Form.Label className="formLabel">Field to Filter</Form.Label>
        <Form.Control as="select">
          <option>name</option>
          <option>username</option>
          <option>title</option>
          <option>role</option>
          <option>dob</option>
          <option>age</option>
          <option>gender</option>
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
      <Button variant="success" type="submit" className="filterFormBtn">Filter</Button>
      <Button variant="secondary" className="filterFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default FilterUserForm;
