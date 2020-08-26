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
        <Form.Label className="formLabel">Address Number</Form.Label>
        <Form.Control type="number" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="street">
        <Form.Label className="formLabel">Address Street</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

    </Form.Row>

    <Form.Row>

      <Form.Group as={Col} controlId="town">
        <Form.Label className="formLabel">Address Town</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="city">
        <Form.Label className="formLabel">Address City</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="parish">
        <Form.Label className="formLabel">Address Parish</Form.Label>
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

      <Form.Group as={Col} controlId="country">
        <Form.Label className="formLabel">Address Country</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>

      <Form.Group as={Col} controlId="postalCode">
        <Form.Label className="formLabel">Address PostalCode</Form.Label>
        <Form.Control type="text" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddAddressForm;
