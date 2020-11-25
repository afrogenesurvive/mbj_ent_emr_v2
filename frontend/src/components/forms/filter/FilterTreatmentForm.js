import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './filterForms.css';

const FilterTreatmentForm = (props) => {

return (
<div className="filterFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Control type="text" hidden='true' value="treatment"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="key" className="formGroup">
        <Form.Label className="formLabel">Field to Filter</Form.Label>
        <Form.Control as="select">
        <option>type</option>
        <option>title</option>
        <option>description</option>
        <option>dose</option>
        <option>frequency</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="value" className="formGroup">
        <Form.Label className="formLabel">Filter Type</Form.Label>
        <Form.Control as="select">
          <option>Ascending</option>
          <option>Descending</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="filterFormBtn searchBtn">Filter</Button>
      <Button variant="danger" className="filterFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default FilterTreatmentForm;
