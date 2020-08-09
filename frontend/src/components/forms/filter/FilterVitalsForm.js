import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './filterForms.css';

const FilterVitalsForm = (props) => {

return (
<div className="filterFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Control type="text" hidden='true' value="vitals"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="key">
        <Form.Label>Field</Form.Label>
        <Form.Control as="select">
        <option>pr</option>
        <option>bp1</option>
        <option>bp2</option>
        <option>rr</option>
        <option>temp</option>
        <option>ps02</option>
        <option>heightUnit</option>
        <option>heightValue</option>
        <option>weightUnit</option>
        <option>weightValue</option>
        <option>bmi</option>
        <option>urine.type</option>
        <option>urine.value</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="value">
        <Form.Label>Query</Form.Label>
        <Form.Control as="select">
          <option>Ascending</option>
          <option>Descending</option>
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

export default FilterVitalsForm;