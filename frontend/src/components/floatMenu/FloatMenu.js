import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import moment from 'moment-timezone';
import loadingGif from '../../assets/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faFolderMinus,
  faEye,
  faEraser,
  faTrashAlt,
  faBan,
  faCheckSquare,
  faExternalLinkAlt,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

import "./menus.css"

const FloatMenu = (props) =>{

  let highlighted;
  if (props.subMenuState === true) {
    highlighted = `${props.page}${props.menu}${props.subMenu}`;
  } else {
    highlighted = `${props.page}${props.menu}`;
  }

return (
  <div className="FloatMenuTop">

  {props.state === 'menuProfile' && (
    <ul className="FloatMenuList">
      <li>
      {highlighted === 'profileall' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'all')}>All</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'all')}>All</Button>
      )}
      </li>
      <li>
      {highlighted === 'profilebasic' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'basic')}>Basic</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'basic')}>Basic</Button>
      )}
      </li>
      <li>
      {highlighted === 'profileadmin' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'admin')}>Admin</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'admin')}>Admin</Button>
      )}
      </li>
      <li>
      {highlighted === 'profileaddress' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'address')}>Addresses</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'address')}>Addresses</Button>
      )}
      </li>
      <li>
      {highlighted === 'profileattendance' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'attendance')}>Attendance</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'attendance')}>Attendance</Button>
      )}
      </li>
      <li>
      {highlighted === 'profileleave' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'leave')}>Leave</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'leave')}>Leave</Button>
      )}
      </li>
      <li>
      {highlighted === 'profileimage' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'image')}>Images</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'image')}>Images</Button>
      )}
      </li>
      <li>
      {highlighted === 'profilefile' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'file')}>Files</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'file')}>Files</Button>
      )}
      </li>
      <li>
      {highlighted === 'profileappointment' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'appointment')}>Appointments</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'appointment')}>Appointments</Button>
      )}
      </li>
      <li>
      {highlighted === 'profilevisit' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'visit')}>Visits</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'visit')}>Visits</Button>
      )}
      </li>
      <li>
      {highlighted === 'profilenote' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'note')}>Notes</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'note')}>Notes</Button>
      )}
      </li>
    </ul>
  )}

  {props.state === 'menuStaff' && (
    <ul className="FloatMenuList">
      <li>
      {highlighted === 'stafflist' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      )}
      </li>
      <li>
      {highlighted === 'staffsearch' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      )}
      </li>
      <li>
      {highlighted.includes('staffdetail') === true ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      )}
      </li>
    </ul>
  )}

  {props.state === 'menuPatient' && (
    <ul className="FloatMenuList">
      <li>
      {highlighted === 'patientlist' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      )}
      </li>
      <li>
      {highlighted === 'patientsearch' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      )}
      </li>
      <li>
      {highlighted.includes('patientdetail') === true ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      )}
      </li>
      <li>
      {highlighted === 'patientnew' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
      )}
      </li>
    </ul>
  )}

  {props.state === 'menuAppointment' && (
    <ul className="FloatMenuList">
      <li>
      {highlighted === 'appointmentlist' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      )}
      </li>
      <li>
      {highlighted === 'appointmentsearch' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      )}
      </li>
      <li>
      {highlighted.includes('appointmentdetail') === true ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      )}
      </li>
      <li>
      {highlighted === 'appointmentnew' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
      )}
      </li>
    </ul>
  )}

  {props.state === 'menuVisit' && (
    <ul className="FloatMenuList">
      <li>
      {highlighted === 'visitlist' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      )}
      </li>
      <li>
      {highlighted === 'visitsearch' ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      )}
      </li>
      <li>
      {highlighted.includes('visitdetail') === true ? (
        <Button variant="success" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      ):(
        <Button variant="light" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      )}
      </li>
      {props.role === 'Nurse' && (
        <li>
        {highlighted === 'visitnew' ? (
          <Button variant="success" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
        ):(
          <Button variant="light" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
        )}
        </li>
      )}
      {props.role === 'Doctor' && (
        <li>
        {highlighted === 'visitnew' ? (
          <Button variant="success" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
        ):(
          <Button variant="light" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
        )}
        </li>
      )}
    </ul>
  )}

  {props.subMenuState === true &&
    props.page === 'patient' && (
    <ul className="FloatSubMenuList">
    <li>
    {highlighted === 'patientdetailall' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailbasic' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailcomorbidities' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'comorbidities')}>Comorbidities</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'comorbidities')}>Comorbidities</Button>
    )}
    {props.hasComorbidities === true && (
      <OverlayTrigger
        placement={'top'}
        overlay={
          <Popover id={`popover-positioned-${'top'}`}>
            <Popover.Content>
              <strong>Comorbidities Present!!</strong>
            </Popover.Content>
          </Popover>
        }
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="menuAttentionIcon" color="yellow" size="sm"/>
      </OverlayTrigger>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailadmin' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailaddress' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'address')}>Address</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'address')}>Address</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailnextOfKin' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'nextOfKin')}>Next-of-Kin</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'nextOfKin')}>Next-of-Kin</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailallergy' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'allergy')}>Allergy</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'allergy')}>Allergy</Button>
    )}
    {props.hasAllergies === true && (
      <OverlayTrigger
        placement={'top'}
        overlay={
          <Popover id={`popover-positioned-${'top'}`}>
            <Popover.Content>
              <strong>Allergies Present!!</strong>
            </Popover.Content>
          </Popover>
        }
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="menuAttentionIcon" color="yellow" size="sm"/>
      </OverlayTrigger>
    )}
    {props.hasAllergies === false && (
      <OverlayTrigger
        placement={'top'}
        overlay={
          <Popover id={`popover-positioned-${'top'}`}>
            <Popover.Content>
              <strong>Allergy Info Needed!!</strong>
            </Popover.Content>
          </Popover>
        }
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="menuAttentionIcon" color="red" size="sm"/>
      </OverlayTrigger>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailmedication' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'medication')}>Medication</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'medication')}>Medication</Button>
    )}
    </li>

    <li>
    {highlighted === 'patientdetailimage' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'image')}>Image</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'image')}>Image</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailfile' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'file')}>File</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'file')}>File</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailappointment' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'appointment')}>Appointment</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'appointment')}>Appointment</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailvisit' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'visit')}>Visit</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'visit')}>Visit</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailnote' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetailtag' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'tag')}>Tag</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'tag')}>Tag</Button>
    )}
    </li>
    <li>
    {highlighted === 'patientdetaildoc' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'doc')}>Docs</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'doc')}>Docs</Button>
    )}
    </li>
    </ul>
  )}

  {props.subMenuState === true &&
    props.page === 'staff' && (
    <ul className="FloatSubMenuList">
    <li>
    {highlighted === 'staffdetailall' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailbasic' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailadmin' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailaddress' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'address')}>Address</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'address')}>Address</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailattendance' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'attendance')}>Attendance</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'attendance')}>Attendance</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailleave' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'leave')}>Leave</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'leave')}>Leave</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailimage' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'image')}>Image</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'image')}>Image</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailfile' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'file')}>File</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'file')}>File</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailappointment' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'appointment')}>Appointment</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'appointment')}>Appointment</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailvisit' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'visit')}>Visit</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'visit')}>Visit</Button>
    )}
    </li>
    <li>
    {highlighted === 'staffdetailnote' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    )}
    </li>
    </ul>
  )}
  {props.subMenuState === true &&
    props.page === 'appointment' && (
    <ul className="FloatSubMenuList">
    <li>
    {highlighted === 'appointmentdetailall' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    )}
    </li>
    <li>
    {highlighted === 'appointmentdetailbasic' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    )}
    </li>
    <li>
    {highlighted === 'appointmentdetailadmin' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    )}
    </li>
    <li>
    {highlighted === 'appointmentdetailconsultant' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'consultant')}>Consultants</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'consultant')}>Consultants</Button>
    )}
    </li>
    <li>
    {highlighted === 'appointmentdetailnote' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    )}
    </li>
    <li>
    {highlighted === 'appointmentdetailtag' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'tag')}>Tag</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'tag')}>Tag</Button>
    )}
    </li>
    </ul>
  )}
  {props.subMenuState === true &&
    props.page === 'visit' && (
    <ul className="FloatSubMenuList">
    <li>
    {highlighted === 'visitdetailall' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailbasic' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailcomorbidities' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'comorbidities')}>Comorbidities</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'comorbidities')}>Comorbidities</Button>
    )}
    {props.hasComorbidities === true && (
      <OverlayTrigger
        placement={'top'}
        overlay={
          <Popover id={`popover-positioned-${'top'}`}>
            <Popover.Content>
              <strong>Comorbidities Present!!</strong>
            </Popover.Content>
          </Popover>
        }
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="menuAttentionIcon" color="yellow" size="sm"/>
      </OverlayTrigger>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailallergy' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'allergy')}>Allergy</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'allergy')}>Allergy</Button>
    )}
    {props.hasAllergies === true && (
      <OverlayTrigger
        placement={'top'}
        overlay={
          <Popover id={`popover-positioned-${'top'}`}>
            <Popover.Content>
              <strong>Allergies Present!!</strong>
            </Popover.Content>
          </Popover>
        }
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="menuAttentionIcon" color="yellow" size="sm"/>
      </OverlayTrigger>
    )}
    {props.hasAllergies === false && (
      <OverlayTrigger
        placement={'top'}
        overlay={
          <Popover id={`popover-positioned-${'top'}`}>
            <Popover.Content>
              <strong>Allergy Info Needed!!</strong>
            </Popover.Content>
          </Popover>
        }
      >
        <FontAwesomeIcon icon={faExclamationTriangle} className="menuAttentionIcon" color="yellow" size="sm"/>
      </OverlayTrigger>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailmedication' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'medication')}>Medication</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'medication')}>Medication</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailadmin' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailconsultant' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'consultant')}>Consultants</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'consultant')}>Consultants</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailcomplaint' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'complaint')}>Complaints</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'complaint')}>Complaints</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailsurvey' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'survey')}>Surveys</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'survey')}>Surveys</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailsystematicInquiry' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'systematicInquiry')}>Systematic Inquiry</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'systematicInquiry')}>Systematic Inquiry</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailvitals' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'vitals')}>Vitals</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'vitals')}>Vitals</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailexamination' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'examination')}>Examination</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'examination')}>Examination</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailinvestigation' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'investigation')}>Investigation</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'investigation')}>Investigation</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetaildiagnosis' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'diagnosis')}>Diagnosis</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'diagnosis')}>Diagnosis</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailtreatment' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'treatment')}>Plan</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'treatment')}>Plan</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailbilling' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'billing')}>Billing</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'billing')}>Billing</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailvigilance' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'vigilance')}>Vigilance</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'vigilance')}>Vigilance</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailimage' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'image')}>Images</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'image')}>Images</Button>
    )}
    </li>
    <li>
    {highlighted === 'visitdetailfile' ? (
      <Button variant="success" onClick={props.subMenuSelect.bind(this, 'file')}>Files</Button>
    ):(
      <Button variant="light" onClick={props.subMenuSelect.bind(this, 'file')}>Files</Button>
    )}
    </li>
    </ul>
  )}

  </div>
)

}

export default FloatMenu;
