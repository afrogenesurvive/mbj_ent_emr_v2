import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
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
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';

import "./loadingOverlay.css"

const LoadingOverlay2 = (props) =>{

return (
  <div className="attachmentViewerBg2">
    <div className="loadingOverlay2">
    <Row className="overlayCloseRow2">
      <Button className="sidebarButton" variant="warning" onClick={props.toggleOverlay2}>X</Button>
    </Row>

    <Image src={loadingGif} className="overlayLoadingGif" fluid />

    </div>
  </div>
)

}

export default LoadingOverlay2;
