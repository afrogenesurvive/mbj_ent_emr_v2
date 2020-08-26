import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './searchForms.css';

const PatientSearchForm = (props) => {

return (
<div className="searchFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    <Form.Row>
      <Form.Group as={Col} controlId="field">
        <Form.Label className="formLabel">Field</Form.Label>
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
        <option>referral.date</option>
        <option>referral.reason</option>
        <option>referral.physician.name</option>
        <option>referral.physician.email</option>
        <option>referral.physician.phone</option>
        <option>attendingPhysician</option>
        <option>occupation.role</option>
        <option>occupation.employer.name</option>
        <option>occupation.employer.phone</option>
        <option>occupation.employer.email</option>
        <option>insurance.company</option>
        <option>insurance.policyNumber</option>
        <option>insurance.description</option>
        <option>insurance.expiryDate</option>
        <option>insurance.subscriber.company</option>
        <option>insurance.subscriber.description</option>
        <option>nextOfKin.name</option>
        <option>nextOfKin.relation</option>
        <option>nextOfKin.contact.email</option>
        <option>nextOfKin.contact.phone</option>
        <option>nextOfKin.contact.phone2</option>
        <option>allergies.type</option>
        <option>allergies.title</option>
        <option>allergies.description</option>
        <option>allergies.attachments</option>
        <option>medication.title</option>
        <option>medication.type</option>
        <option>medication.description</option>
        <option>medication.attachments</option>
        <option>images.name</option>
        <option>images.type</option>
        <option>images.path</option>
        <option>files.name</option>
        <option>files.type</option>
        <option>files.path</option>
        <option>notes</option>
        <option>tags</option>
        <option>loggedIn</option>
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

export default PatientSearchForm;
