import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import UserList from '../../lists/user/UserList';
import './addForms.css';

const AddUserForm = (props) => {

  const [user, setUser] = useState("");
  const handleSetUser = (args) => {
    setUser(args);
   }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    <h4>Add Staff</h4>

    <Form.Row>
      <UserList
        users={props.users}
        selectUser={handleSetUser}
        filter={props.filter}
      />
    </Form.Row>

    <Form.Row>
      <Form.Group as={Col} controlId="user">
        <Form.Label>user</Form.Label>
        <Form.Control type="text" value={user._id}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="outline-success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="outline-primary" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddUserForm;
