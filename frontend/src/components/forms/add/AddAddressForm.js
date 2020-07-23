import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './addForms.css';

const AddAddressForm = (props) => {

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Address</h4>
    <Form.Row>
      <Form.Group as={Col} controlId="number">
        <Form.Label>addressNumber</Form.Label>
        <Form.Control type="number" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="street">
        <Form.Label>addressStreet</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="town">
        <Form.Label>addressTown</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="city">
        <Form.Label>addressCity</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="parish">
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

      <Form.Group as={Col} controlId="country">
        <Form.Label>addressCountry</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="postalCode">
        <Form.Label>addressPostalCode</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddAddressForm;
