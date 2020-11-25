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
  <Form.Row className="formRow">
    <Form.Group className="searchInput formGroup" controlId="type">
      <Form.Label className="formLabel">Type</Form.Label>
      <Form.Control as="select">
        <option>email</option>
      </Form.Control>
    </Form.Group>
  </Form.Row>

  <Form.Row className="formRow">
    <Form.Group as={Col} controlId="username" className="formGroup">
      <Form.Label className="formLabel">Username</Form.Label>
      <Form.Control type="text" placeholder="username"/>
    </Form.Group>
  </Form.Row>

  <Form.Row className="formRow">
    <Form.Group as={Col} controlId="email" className="formGroup">
      <Form.Label className="formLabel">Email</Form.Label>
      <Form.Control type="text" placeholder="email"/>
    </Form.Group>
  </Form.Row>

  <Form.Row className="formRow">
    <Form.Group as={Col} controlId="code" className="formGroup">
      <Form.Label className="formLabel">Code</Form.Label>
      <Form.Control type="text" placeholder="verification code"/>
    </Form.Group>
  </Form.Row>

  <Form.Row className="formBtnRow">
    {props.canCancel && (
      <Button variant="danger" className="formButton" onClick={props.onCancel}>
      Cancel
      </Button>
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
