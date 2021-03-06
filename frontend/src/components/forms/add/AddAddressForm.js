import React from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './addForms.css';

const AddAddressForm = (props) => {
  let placeHolders = {
    number: 0,
    street: '...',
    town: '...',
    city: '...',
    parish: '...',
    country: '...',
    postalCode: '...',
  }
  if (props.previousAddress) {
    placeHolders = {
      number: props.previousAddress.number,
      street: props.previousAddress.street,
      town: props.previousAddress.town,
      city: props.previousAddress.city,
      parish: props.previousAddress.parish,
      country: props.previousAddress.country,
      postalCode: props.previousAddress.postalCode,
    }
  }


return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    {props.previousAddress && (
      <h4>Update Address</h4>
    )}
    {!props.previousAddress && (
      <h4>Add Address</h4>
    )}
    <p>required feilds are denoted by a ' * '</p>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="number" className="formGroup">
        <Form.Label className="formLabel">Address Number * </Form.Label>
        <Form.Control type="number" placeholder={placeHolders.number}/>
      </Form.Group>

      <Form.Group as={Col} controlId="street" className="formGroup">
        <Form.Label className="formLabel">Address Street * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.street}/>
      </Form.Group>

    </Form.Row>

    <Form.Row className="formRow">

      <Form.Group as={Col} controlId="town" className="formGroup">
        <Form.Label className="formLabel">Address Town</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.town}/>
      </Form.Group>

      <Form.Group as={Col} controlId="city" className="formGroup">
        <Form.Label className="formLabel">Address City * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.city}/>
      </Form.Group>

    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="parish" className="formGroup">
        <Form.Label className="formLabel">Address Parish</Form.Label>
        <Form.Control as="select">
          <option>{placeHolders.parish}</option>
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

      <Form.Group as={Col} controlId="country" className="formGroup">
        <Form.Label className="formLabel">Address Country * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.country}/>
      </Form.Group>


    </Form.Row>

    <Form.Row className="formRow">

      <Form.Group as={Col} controlId="postalCode" className="formGroup">
        <Form.Label className="formLabel">Address PostalCode</Form.Label>
        <Form.Control type="text" placeholder={placeHolders.postalCode}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
    {props.previousAddress && (
      <Button variant="success" type="submit" className="addFormBtn">Update</Button>
    )}
    {!props.previousAddress && (
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
    )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddAddressForm;
