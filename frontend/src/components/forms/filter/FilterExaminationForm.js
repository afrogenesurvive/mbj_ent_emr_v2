import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './filterForms.css';

const FilterExaminationForm = (props) => {

return (
<div className="filterFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Control type="text" hidden='true' value="examination"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="key">
        <Form.Label>Field</Form.Label>
        <Form.Control as="select">
        <option>general</option>
        <option>area</option>
        <option>type</option>
        <option>measure</option>
        <option>value</option>
        <option>description</option>
        <option>followUp</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="value">
        <Form.Label>Query</Form.Label>
        <Form.Control as="select">
          <option>Ascending</option>
          <option>Descending</option>
          <option>true</option>
          <option>false</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="outline-success" type="submit" className="filterFormBtn">Filter</Button>
      <Button variant="outline-secondary" className="filterFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default FilterExaminationForm;