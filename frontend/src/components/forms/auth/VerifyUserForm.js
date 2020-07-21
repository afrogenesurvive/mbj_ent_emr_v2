import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const verifyUserForm = (props) => {

return (
<div className="UpdateFormContainer">
<Form onSubmit={props.onConfirm}>
  <h1>Verify</h1>
  <Form.Row>
    <Form.Group className="searchInput" controlId="type">
      <Form.Label>type</Form.Label>
      <Form.Control as="select">
        <option>email</option>
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="username">
      <Form.Label>username</Form.Label>
      <Form.Control type="text" placeholder="username"/>
    </Form.Group>
  </Form.Row>

  <Form.Row>
    <Form.Group as={Col} controlId="email">
      <Form.Label>email</Form.Label>
      <Form.Control type="text" placeholder="email"/>
    </Form.Group>

    <Form.Group as={Col} controlId="code">
      <Form.Label>code</Form.Label>
      <Form.Control type="text" placeholder="verification code"/>
    </Form.Group>
  </Form.Row>

<Form.Row>
  {props.canCancel && (
    <Button variant="danger" className="formButton" onClick={props.onCancel}>Cancel</Button>
  )}

  {props.canConfirm && (
    <Button variant="primary" className="formButton" type="submit">
    Verify
    </Button>
  )}
</Form.Row>

</Form>
</div>

)};

export default verifyUserForm;
