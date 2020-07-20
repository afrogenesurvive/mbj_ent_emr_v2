import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './CreateUserForm.css';

const ResetPasswordForm = (props) => {

return (
<div className="UpdateFormContainer">

<Form onSubmit={props.onConfirm}>

  <Form.Row>
    <Form.Group as={Col} controlId="formGridParams">
    <Form.Control type="text" hidden='true' value={props.params}/>
  </Form.Group>
  </Form.Row>
  <Form.Row>
    <Form.Group as={Col} controlId="formGridPassword">
    <Form.Label>password</Form.Label>
    <Form.Control type="password" placeholder="password"/>
  </Form.Group>
  </Form.Row>

<Form.Row>

  <Button variant="primary" className="formButton" type="submit">
  Reset
  </Button>
  <Button variant="danger" className="formButton" onClick={props.onCancel}>
  cancel
  </Button>

</Form.Row>

</Form>

</div>

)};

export default ResetPasswordForm;
