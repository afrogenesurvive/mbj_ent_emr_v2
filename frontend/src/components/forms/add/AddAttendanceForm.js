import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddAttendanceForm = (props) => {

  let placeHolders = {
    date: '...',
    status: '...',
    description: '...',
  }
  if (props.previousAttendance) {
    placeHolders = {
      date: props.previousAttendance.date,
      status: props.previousAttendance.status,
      description: props.previousAttendance.description,
    }
  }

  const [startDate, setStartDate] = useState(new Date());
  const handleChangeStartDate = startDate => {
    setStartDate(startDate);
    console.log(`startDate ${startDate}`);
   }
   const [endDate, setEndDate] = useState(new Date());
   const handleChangeEndDate = endDate => {
     setEndDate(endDate);
     console.log(`endDate ${endDate}`);
    }
return (
<div className="addFormTopDiv">
  <Form onSubmit={props.onConfirm}>
  {props.previousAttendance && (
    <h4>Update Attendance</h4>
  )}
  {!props.previousAttendance && (
    <h4>Add Attendance</h4>
  )}
    <p>required feilds are denoted by a ' * '</p>
    <Form.Row className="formRow">
      <Form.Group as={Col} controlId="date" className="formGroup">
        <Form.Label className="formLabel">Date * </Form.Label>
        <Form.Control type="date" placeholder={placeHolders.date}/>
      </Form.Group>
      {
        // <Form.Group as={Col} controlId="">
        //   <Form.Label>startDate</Form.Label>
        //   <DatePicker className="" id="startDate"
        //     selected={startDate}
        //     onChange={handleChangeStartDate}
        //   />
        // </Form.Group>
        // <Form.Group as={Col} controlId="">
        //   <Form.Label>startDate</Form.Label>
        //   <DatePicker className="" id="endDate"
        //     selected={endDate}
        //     onChange={handleChangeEndDate}
        //   />
        // </Form.Group>
      }

    </Form.Row>

    <Form.Row className="formRow">
    <Form.Group as={Col} controlId="status" className="formGroup">
      <Form.Label className="formLabel">Status * </Form.Label>
      <Form.Control type="text" placeholder={placeHolders.status}/>
    </Form.Group>
    </Form.Row>

    <Form.Row className="formRow">
    <Form.Group as={Col} controlId="description" className="formGroup">
      <Form.Label className="formLabel">Description</Form.Label>
      <Form.Control as="textarea" rows="3" placeholder={placeHolders.description}/>
    </Form.Group>
    </Form.Row>

    <Form.Row className="formBtnRow">
      {props.previousAttendance && (
        <Button variant="success" type="submit" className="addFormBtn">Update</Button>
      )}
      {!props.previousAttendance && (
        <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      )}
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddAttendanceForm;
