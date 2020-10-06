import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './createForms.css';
import moment from 'moment';

const CreatePatientForm = (props) => {
  const today = moment().format('YYYY-MM-DD')
return (
<div className="loginFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h1>Create Patient Form</h1>
    <p> " * " indicates required fields...</p>

    <Form.Row>
      <Form.Group as={Col} controlId="title">
        <Form.Label className="formLabel">Title *</Form.Label>
        <Form.Control as="select">
          <option>Mr</option>
          <option>Mrs</option>
          <option>Ms</option>
          <option>Dr</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="name">
        <Form.Label className="formLabel">First Name *</Form.Label>
        <Form.Control type="text" placeholder="name"/>
      </Form.Group>
      <Form.Group as={Col} controlId="lastName">
        <Form.Label className="formLabel">Last Name *</Form.Label>
        <Form.Control type="text" placeholder="last name"/>
      </Form.Group>

      <Form.Group as={Col} controlId="username">
        <Form.Label className="formLabel">username *</Form.Label>
        <Form.Control type="text" placeholder="username"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="dob">
        <Form.Label className="formLabel">dob *</Form.Label>
        <Form.Control type="date" placeholder="YYYY-MM-DD"/>
      </Form.Group>

      <Form.Group as={Col} controlId="gender">
        <Form.Label className="formLabel">gender *</Form.Label>
        <Form.Control as="select">
          <option>Female</option>
          <option>Male</option>
          <option>Prefer Not to Say</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="role">
        <Form.Label className="formLabel">role </Form.Label>
        <Form.Control type="text" value="standard patient"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="contactEmail">
        <Form.Label className="formLabel">email *</Form.Label>
        <Form.Control type="email" placeholder="alpha@beta.omega"/>
      </Form.Group>

      <Form.Group as={Col} controlId="contactPhone">
        <Form.Label className="formLabel">phone *</Form.Label>
        <Form.Control type="text" placeholder="+18760001234"/>
      </Form.Group>

      <Form.Group as={Col} controlId="contactPhone2">
        <Form.Label className="formLabel">phone2</Form.Label>
        <Form.Control type="text" placeholder="+18760005678"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="addressNumber">
        <Form.Label className="formLabel">addressNumber</Form.Label>
        <Form.Control type="number" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressStreet">
        <Form.Label className="formLabel">addressStreet</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressTown">
        <Form.Label className="formLabel">addressTown</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="addressCity">
        <Form.Label className="formLabel">addressCity</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressParish">
        <Form.Label className="formLabel">addressParish</Form.Label>
        <Form.Control as="select">
          <option>none</option>
          <option>Clarendon</option>
          <option>Hanover</option>
          <option>Kingston</option>
          <option>Manchester</option>
          <option>Portland</option>
          <option>St. Andrew</option>
          <option>St. Ann</option>
          <option>St. Catherine</option>
          <option>St. Elizabeth</option>
          <option>St. James</option>
          <option>St. Mary</option>
          <option>St. Thomas</option>
          <option>Trelawny</option>
          <option>Westmoreland</option>
        </Form.Control>
      </Form.Group>

      <Form.Group as={Col} controlId="addressCountry">
        <Form.Label className="formLabel">addressCountry</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="addressPostalCode">
        <Form.Label className="formLabel">addressPostalCode</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="referralDate">
        <Form.Label className="formLabel">referralDate: YYYY-MM-DD</Form.Label>
        <Form.Control type="date" placeholder={today}/>
      </Form.Group>

      <Form.Group as={Col} controlId="referralReason">
        <Form.Label className="formLabel">referralReason</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="referralReason"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="referralPhysicianName">
        <Form.Label className="formLabel">referralPhysicianName</Form.Label>
        <Form.Control type="text" placeholder="referralPhysicianName"/>
      </Form.Group>
      <Form.Group as={Col} controlId="referralPhysicianPhone">
        <Form.Label className="formLabel">referralPhysicianPhone</Form.Label>
        <Form.Control type="text" placeholder="referralPhysicianPhone"/>
      </Form.Group>
      <Form.Group as={Col} controlId="referralPhysicianEmail">
        <Form.Label className="formLabel">referralPhysicianEmail</Form.Label>
        <Form.Control type="email" placeholder="alpha@beta.omega"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="referralPhysicianAddress">
        <Form.Label className="formLabel">referralPhysicianAddress</Form.Label>
        <Form.Control as="textarea" rows="5" placeholder="referralPhysicianAddress"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="attendingPhysician">
        <Form.Label className="formLabel">attendingPhysician</Form.Label>
        <Form.Control type="text" placeholder="attendingPhysician"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="occupationRole">
        <Form.Label className="formLabel">occupationRole</Form.Label>
        <Form.Control type="text" placeholder="occupationRole"/>
      </Form.Group>
      <Form.Group as={Col} controlId="occupationEmployerName">
        <Form.Label className="formLabel">occupationEmployerName</Form.Label>
        <Form.Control type="text" placeholder="occupationEmployerName"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="occupationEmployerEmail">
        <Form.Label className="formLabel">occupationEmployerEmail</Form.Label>
        <Form.Control type="email" placeholder="alpha@beta.omega"/>
      </Form.Group>
      <Form.Group as={Col} controlId="occupationEmployerPhone">
        <Form.Label className="formLabel">occupationEmployerPhone</Form.Label>
        <Form.Control type="text" placeholder="occupationEmployerPhone"/>
      </Form.Group>
      <Form.Group as={Col} controlId="occupationEmployerAddress">
        <Form.Label className="formLabel">occupationEmployerAddress</Form.Label>
        <Form.Control as="textarea" rows="5" placeholder="occupationEmployerAddress"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="insuranceCompany">
        <Form.Label className="formLabel">insuranceCompany</Form.Label>
        <Form.Control as="select">
          <option>Guardian</option>
          <option>Sagicor</option>
          <option>Canopy</option>
          <option>Other</option>
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col} controlId="insurancePolicyNumber">
        <Form.Label className="formLabel">insurancePolicyNumber</Form.Label>
        <Form.Control type="text" placeholder="insurancePolicyNumber"/>
      </Form.Group>
      <Form.Group as={Col} controlId="insuranceExpiryDate">
        <Form.Label className="formLabel">insuranceExpiryDate</Form.Label>
        <Form.Control type="date" placeholder={today}/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="insuranceDescription">
        <Form.Label className="formLabel">insuranceDescription</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="insuranceDescription"/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="insuranceSubscriberCompany">
        <Form.Label className="formLabel">insuranceSubscriberCompany</Form.Label>
        <Form.Control type="text" placeholder="insuranceSubscriberCompany"/>
      </Form.Group>
      <Form.Group as={Col} controlId="insuranceSubscriberDescription">
        <Form.Label className="formLabel">insuranceSubscriberDescription</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder="insuranceSubscriberDescription"/>
      </Form.Group>
      <Form.Group as={Col} controlId="active">
        <Form.Label>Active</Form.Label>
        <Form.Control type="checkbox" />
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Button variant="success" type="submit" className="loginFormBtn searchBtn">Create</Button>
      <Button variant="danger" className="loginFormBtn searchBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default CreatePatientForm;
