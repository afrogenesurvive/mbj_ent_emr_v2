import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './searchForms.css';

const VisitSearchForm = (props) => {

return (
<div className="searchFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Label>Field</Form.Label>
        <Form.Control as="select">
        <option>date</option>
        <option>time</option>
        <option>title</option>
        <option>type</option>
        <option>subType</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="query">
        <Form.Label>Query</Form.Label>
        <Form.Control type="text" placeholder="date format: 'YYYY-MM-DD'"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="outline-success" type="submit" className="filterFormBtn">Search</Button>
      <Button variant="outline-secondary" className="filterFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default VisitSearchForm;