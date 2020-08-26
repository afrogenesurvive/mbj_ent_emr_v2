import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './searchForms.css';

const AppointmentSearchForm = (props) => {

return (
<div className="searchFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Label className="formLabel">Field</Form.Label>
        <Form.Control as="select">
        <option>title</option>
        <option>type</option>
        <option>subType</option>
        <option>date</option>
        <option>time</option>
        <option>checkinTime</option>
        <option>seenTime</option>
        <option>location</option>
        <option>description</option>
        <option>inProgress</option>
        <option>attended</option>
        <option>important</option>
        <option>notes</option>
        <option>tags</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="query">
        <Form.Label className="formLabel">Value</Form.Label>
        <Form.Control type="text" placeholder="date format: 'YYYY-MM-DD'"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="success" type="submit" className="filterFormBtn">Search</Button>
      <Button variant="secondary" className="filterFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AppointmentSearchForm;
