import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './filterForms.css';

const FilterAppointmentForm = (props) => {

return (
<div className="filterFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Control type="text" hidden={true} readOnly value="appointment"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="key">
        <Form.Label className="formLabel">Field to Filter</Form.Label>
        <Form.Control as="select">
          <option>title</option>
          <option>type</option>
          <option>subType</option>
          <option>date</option>
          <option>time</option>
          <option>location</option>
          <option>important</option>
          <option>inProgress</option>
          <option>attended</option>
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
      <Button variant="secondary" className="filterFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default FilterAppointmentForm;
