import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddComorbidityForm = (props) => {

  let placeHolders = {
    title: '....',
    type: '....',
    description: '....',
  }
  if (props.previousComorbidity) {
    placeHolders = {
      title: props.previousComorbidity.title,
      type: props.previousComorbidity.type,
      description: props.previousComorbidity.description,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
  {props.previousComorbidity && (
    <h4>Update Comorbidity</h4>
  )}
  {!props.previousComorbidity && (
    <h4>Add Comorbidity</h4>
  )}

    <p>Required fields are denoted by a ' * '</p>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="title" className="formGroup">
        <Form.Label className="formLabel">Comorbidity * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.title}/>
      </Form.Group>
    </Form.Row>

    {
      // <Form.Row className="formRow">
      //   <Form.Group as={Col} controlId="type" className="formGroup">
      //     <Form.Label className="formLabel">Type * </Form.Label>
      //     <Form.Control type="text" placeholder="..."/>
      //   </Form.Group>
      // </Form.Row>
    }

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousComorbidity && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousComorbidity && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddComorbidityForm;
