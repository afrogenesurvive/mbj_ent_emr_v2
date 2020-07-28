import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './createForms.css';

const CreatePatientForm = (props) => {

return (
<div className="loginFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h1>Create Patient Form</h1>
    <Form.Row>
      <Form.Group as={Col} controlId="active">
        <Form.Label>Active</Form.Label>
        <Form.Control as="select">
          <option>false</option>
          <option>true</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control as="select">
          <option>Mr</option>
          <option>Mrs</option>
          <option>Ms</option>
          <option>Dr</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="name">
        <Form.Label>name</Form.Label>
        <Form.Control type="text" placeholder="name"/>
      </Form.Group>

      <Form.Group as={Col} controlId="username">
        <Form.Label>username</Form.Label>
        <Form.Control type="text" placeholder="username"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="dob">
        <Form.Label>dob</Form.Label>
        <Form.Control type="date" placeholder="YYYY-MM-DD"/>
      </Form.Group>

      <Form.Group as={Col} controlId="gender">
        <Form.Label>gender</Form.Label>
        <Form.Control as="select">
          <option>Female</option>
          <option>Male</option>
          <option>Prefer Not to Say</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="role">
        <Form.Label>role</Form.Label>
        <Form.Control type="text" placeholder="role"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="contactEmail">
        <Form.Label>email</Form.Label>
        <Form.Control type="email" placeholder="alpha@beta.omega"/>
      </Form.Group>

      <Form.Group as={Col} controlId="contactPhone">
        <Form.Label>phone</Form.Label>
        <Form.Control type="text" placeholder="+18760001234"/>
      </Form.Group>

      <Form.Group as={Col} controlId="contactPhone2">
        <Form.Label>phone2</Form.Label>
        <Form.Control type="text" placeholder="+18760005678"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="addressNumber">
        <Form.Label>addressNumber</Form.Label>
        <Form.Control type="number" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressStreet">
        <Form.Label>addressStreet</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressTown">
        <Form.Label>addressTown</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="addressCity">
        <Form.Label>addressCity</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressParish">
        <Form.Label>addressParish</Form.Label>
        <Form.Control as="select">
          <option>none</option>
          <option>Hanover</option>
          <option>St. Elizabeth</option>
          <option>St. James</option>
          <option>Trelawny</option>
          <option>Westmoreland</option>
          <option>Clarendon</option>
          <option>Manchester</option>
          <option>St. Ann</option>
          <option>St. Catherine</option>
          <option>St. Mary</option>
          <option>Kingston</option>
          <option>St. Andrew</option>
          <option>Portland</option>
          <option>St. Thomas</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="addressCountry">
        <Form.Label>addressCountry</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressPostalCode">
        <Form.Label>addressPostalCode</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="referralDate">
        <Form.Label>referralDate</Form.Label>
        <Form.Control type="date" placeholder="YYYY-MM-DD"/>
      </Form.Group>

      <Form.Group as={Col} controlId="referralReason">
        <Form.Label>referralReason</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="referralReason"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="referralPhysicianName">
        <Form.Label>referralPhysicianName</Form.Label>
        <Form.Control type="text" placeholder="referralPhysicianName"/>
      </Form.Group>
      <Form.Group as={Col} controlId="referralPhysicianPhone">
        <Form.Label>referralPhysicianPhone</Form.Label>
        <Form.Control type="text" placeholder="referralPhysicianPhone"/>
      </Form.Group>
      <Form.Group as={Col} controlId="referralPhysicianEmail">
        <Form.Label>referralPhysicianEmail</Form.Label>
        <Form.Control type="email" placeholder="alpha@beta.omega"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="referralPhysicianAddress">
        <Form.Label>referralPhysicianAddress</Form.Label>
        <Form.Control as="textarea" rows="5" placeholder="referralPhysicianAddress"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="attendingPhysician">
        <Form.Label>attendingPhysician</Form.Label>
        <Form.Control type="text" placeholder="attendingPhysician"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="occupationRole">
        <Form.Label>occupationRole</Form.Label>
        <Form.Control type="text" placeholder="occupationRole"/>
      </Form.Group>
      <Form.Group as={Col} controlId="occupationEmployerName">
        <Form.Label>occupationEmployerName</Form.Label>
        <Form.Control type="text" placeholder="occupationEmployerName"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="occupationEmployerEmail">
        <Form.Label>occupationEmployerEmail</Form.Label>
        <Form.Control type="email" placeholder="alpha@beta.omega"/>
      </Form.Group>
      <Form.Group as={Col} controlId="occupationEmployerPhone">
        <Form.Label>occupationEmployerPhone</Form.Label>
        <Form.Control type="text" placeholder="occupationEmployerPhone"/>
      </Form.Group>
      <Form.Group as={Col} controlId="occupationEmployerAddress">
        <Form.Label>occupationEmployerAddress</Form.Label>
        <Form.Control as="textarea" rows="5" placeholder="occupationEmployerAddress"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="occupationEmployerAddress">
        <Form.Label>occupationEmployerAddress</Form.Label>
        <Form.Control as="textarea" rows="5" placeholder="occupationEmployerAddress"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="insuranceCompany">
        <Form.Label>insuranceCompany</Form.Label>
        <Form.Control type="text" placeholder="insuranceCompany"/>
      </Form.Group>
      <Form.Group as={Col} controlId="insurancePolicyNumber">
        <Form.Label>insurancePolicyNumber</Form.Label>
        <Form.Control type="text" placeholder="insurancePolicyNumber"/>
      </Form.Group>
      <Form.Group as={Col} controlId="insuranceExpiryDate">
        <Form.Label>insuranceExpiryDate</Form.Label>
        <Form.Control type="date" placeholder="insuranceExpiryDate"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="insuranceDescription">
        <Form.Label>insuranceDescription</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="insuranceDescription"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="insuranceSubscriberCompany">
        <Form.Label>insuranceSubscriberCompany</Form.Label>
        <Form.Control type="text" placeholder="insuranceSubscriberCompany"/>
      </Form.Group>
      <Form.Group as={Col} controlId="insuranceSubscriberDescription">
        <Form.Label>insuranceSubscriberDescription</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="insuranceSubscriberDescription"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="outline-success" type="submit" className="loginFormBtn">Create</Button>
      <Button variant="outline-danger" className="loginFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default CreatePatientForm;
