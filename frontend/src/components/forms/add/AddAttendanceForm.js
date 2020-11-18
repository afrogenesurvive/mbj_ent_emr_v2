import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import './addForms.css';

const AddAttendanceForm = (props) => {
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
    <h4>Add Attendance</h4>
    <p>required feilds are denoted by a ' * '</p>
    <Form.Row>
      <Form.Group as={Col} controlId="date">
        <Form.Label className="formLabel">Date * </Form.Label>
        <Form.Control type="date" placeholder="date"/>
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
      <Form.Group as={Col} controlId="status">
        <Form.Label className="formLabel">Status * </Form.Label>
        <Form.Control type="text" placeholder="present/absent"/>
      </Form.Group>

      <Form.Group as={Col} controlId="description">
        <Form.Label className="formLabel">Description</Form.Label>
        <Form.Control as="textarea" rows="3" placeholder=""/>
      </Form.Group>
    </Form.Row>

    <Form.Row>

    </Form.Row>

    <Form.Row>

    </Form.Row>

    <Form.Row className="formBtnRow">
      <Button variant="success" type="submit" className="addFormBtn">Add</Button>
      <Button variant="danger" className="addFormBtn" onClick={props.onCancel}>Cancel</Button>
    </Form.Row>
  </Form>
</div>

)};

export default AddAttendanceForm;
