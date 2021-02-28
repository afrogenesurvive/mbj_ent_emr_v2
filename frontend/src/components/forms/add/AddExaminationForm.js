import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import AuthContext from '../../../context/auth-context';
import './addForms.css';

const AddExaminationForm = (props) => {

  let placeHolders = {
    general: '...',
    area: '...',
    inspection: '...',
    palpation: '...',
    percussion: '...',
    auscultation: '...',
    description: '...',
    followUp: false,
  }
  if (props.previousExamination) {
    placeHolders = {
      general: props.previousExamination.general,
      area: props.previousExamination.area,
      inspection: props.previousExamination.inspection,
      palpation: props.previousExamination.palpation,
      percussion: props.previousExamination.percussion,
      auscultation: props.previousExamination.auscultation,
      description: props.previousExamination.description,
      followUp: props.previousExamination.followUp,
    }
  }

  const [followUpValue, setFollowUpValue] = useState(placeHolders.followUp)
  const handleFollowUpValueChange = (args) => {
    setFollowUpValue(args)
  }

return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>

    {props.previousExamination && (
      <h4>Update Examination</h4>
    )}
    {!props.previousExamination && (
      <h4>Add Examination</h4>
    )}
    <p>required feilds are denoted by a ' * '</p>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="general" className="formGroup">
        <Form.Label className="formLabel">General * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.general}/>
      </Form.Group>

    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="area" className="formGroup">
        <Form.Label className="formLabel">Area * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.area}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="inspection" className="formGroup">
        <Form.Label className="formLabel">Inspection * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.inspection}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="palpation" className="formGroup">
        <Form.Label className="formLabel">Palpation * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.palpation}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="percussion" className="formGroup">
        <Form.Label className="formLabel">Percussion * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.percussion}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="auscultation" className="formGroup">
        <Form.Label className="formLabel">Auscultation * </Form.Label>
        <Form.Control type="text" placeholder={placeHolders.auscultation}/>
      </Form.Group>
    </Form.Row>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="description" className="formGroup">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="followUp" className="formGroup">
        <Form.Label className="formLabel">FollowUp ?</Form.Label>
        <Form.Control type="checkbox" checked={followUpValue} onChange={(e) => {handleFollowUpValueChange(e.target.checked)}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
      <Form.Group as={Col} className="formGroup">
        <Form.Label className="formLabel">File</Form.Label>
        <Form.Control type="file" id="fileInput" placeholder="..." onChange={(e) => {AuthContext._currentValue.file = e.target.files[0]}}/>
      </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">

      {props.previousExamination && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousExamination && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddExaminationForm;
