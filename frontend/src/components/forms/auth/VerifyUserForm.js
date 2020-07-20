import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const verifyUserForm = (props) => {

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridEmail">
    <Form.Label>Email</Form.Label>
    <Form.Control type="text" placeholder="email"/>
  </Form.Group>

  <Form.Group className="searchInput" controlId="formGridType">
  <Form.Label>Type</Form.Label>
  <Form.Control as="select">
  <option>email</option>
  </Form.Control>
  <Form.Text className="text-muted">
  </Form.Text>
  </Form.Group>

    <Form.Group as={Col} controlId="formGridCode">
    <Form.Label>Code</Form.Label>
    <Form.Control type="text" placeholder="verification code"/>
  </Form.Group>
  </Form.Row>

<Form.Row>
{props.canCancel && (
  <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
)}

{props.canConfirm && (
  <Button variant="primary" className="formButton" type="submit">
  Submit
  </Button>
)}
</Form.Row>

</Form>
</div>

)};

export default verifyUserForm;
