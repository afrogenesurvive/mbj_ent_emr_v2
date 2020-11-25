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

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="field" className="formGroup">
        <Form.Label className="formLabel">Search Field</Form.Label>
        <Form.Control as="select">
        <option>date</option>
        <option>time</option>
        <option>title</option>
        <option>type</option>
        <option>subType</option>
        </Form.Control>
      </Form.Group>

    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="query" className="formGroup">
        <Form.Label className="formLabel">Search Query</Form.Label>
        <Form.Control type="text" placeholder="date format: 'YYYY-MM-DD'"/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="filterFormBtn searchBtn">Search</Button>
      <Button variant="danger" className="filterFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default VisitSearchForm;
