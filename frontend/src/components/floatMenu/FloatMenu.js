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
import moment from 'moment';
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
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

import "./menus.css"

const FloatMenu = (props) =>{

return (
  <div className="FloatMenuTop">

  {props.state === 'menuProfile' && (
    <ul className="FloatMenuList">
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'basic')}>Basic</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'admin')}>Admin</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'address')}>Addresses</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'attendance')}>Attendance</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'leave')}>Leave</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'image')}>Images</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'file')}>Files</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'appointment')}>Appointments</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'note')}>Notes</Button>
      </li>
    </ul>
  )}

  {props.state === 'menuStaff' && (
    <ul className="FloatMenuList">
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      </li>
    </ul>
  )}
  {props.state === 'menuPatient' && (
    <ul className="FloatMenuList">
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'list')}>List</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'search')}>Search</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'detail')}>Detail</Button>
      </li>
      <li>
      <Button variant="light" onClick={props.menuSelect.bind(this, 'new')}>New</Button>
      </li>
    </ul>
  )}
  {props.subMenuState === true &&
    props.page === 'patient' && (
    <ul className="FloatSubMenuList">
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'address')}>Address</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'nextOfKin')}>Next-of-Kin</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'allergy')}>Allergy</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'medication')}>Medication</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'comorbidities')}>Comorbidities</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'image')}>Image</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'file')}>File</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'appointment')}>Appointment</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'visit')}>Visit</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'tag')}>Tag</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'doc')}>Docs</Button>
    </li>
    </ul>
  )}
  {props.subMenuState === true &&
    props.page === 'staff' && (
    <ul className="FloatSubMenuList">
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'basic')}>Basic</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'admin')}>Admin</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'address')}>Address</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'attendance')}>Attendance</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'leave')}>Leave</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'image')}>Image</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'file')}>File</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'appointment')}>Appointment</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'note')}>Note</Button>
    </li>
    <li>
    <Button variant="light" onClick={props.subMenuSelect.bind(this, 'all')}>All</Button>
    </li>
    </ul>
  )}

  </div>
)

}

export default FloatMenu;
