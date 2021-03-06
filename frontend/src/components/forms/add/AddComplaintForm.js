import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddComplaintForm = (props) => {

  let placeHolders = {
    title: '....',
    description: '....',
    anamnesis: '....',
  }
  if (props.previousComplaint) {
    placeHolders = {
      title: props.previousComplaint.title,
      description: props.previousComplaint.description,
      anamnesis: props.previousComplaint.anamnesis,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
    {props.previousComplaint && (
      <h4>Update Complaint</h4>
    )}
    {!props.previousComplaint && (
      <h4>Add Complaint</h4>
    )}

    <p>required feilds are denoted by a ' * '</p>

    {
      // <Form.Row className="formRow">
      //   <Form.Group as={Col} controlId="title" className="formGroup">
      //     <Form.Label className="formLabel">Title * </Form.Label>
      //     <Form.Control type="text" placeholder=""/>
      //   </Form.Group>
      // </Form.Row>
    }
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description * </Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="anamnesis" className="formGroup">
        <Form.Label className="formLabel">Anamnesis/History * </Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.anamnesis}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">Attachment</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="..." onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousComplaint && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousComplaint && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddComplaintForm;
