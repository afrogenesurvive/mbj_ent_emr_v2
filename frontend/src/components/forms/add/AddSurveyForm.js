import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddSurveyForm = (props) => {

  let placeHolders = {
    title: '....',
    description: '....',
  }
  if (props.previousSurvey) {
    placeHolders = {
      title: props.previousSurvey.title,
      description: props.previousSurvey.description,
    }
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    {props.previousSurvey && (
      <h4>Update Survey</h4>
    )}
    {!props.previousSurvey && (
      <h4>Add Survey</h4>
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
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">Attachment</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="..." onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousSurvey && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousSurvey && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddSurveyForm;
