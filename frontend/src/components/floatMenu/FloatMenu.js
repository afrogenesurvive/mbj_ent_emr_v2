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

  {props.state === 'menu' && (
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

  </div>
)

}

export default FloatMenu;
