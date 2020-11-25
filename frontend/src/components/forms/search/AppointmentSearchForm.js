import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
}
from '@fortawesome/free-solid-svg-icons';
import {
  faYoutube
}
from '@fortawesome/free-brands-svg-icons';
import './searchForms.css';

const AppointmentSearchForm = (props) => {

return (
<div className="searchFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="field" className="formGroup">
        <Form.Label className="formLabel">Search Field</Form.Label>
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



    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="query" className="formGroup">
        <Form.Label className="formLabel">Search Query</Form.Label>
        <Form.Control type="text" className="fontAwesome" placeholder="&#xF002;"/>
      </Form.Group>

    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="filterFormBtn searchBtn">Search</Button>
      <Button variant="danger" className="filterFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AppointmentSearchForm;
