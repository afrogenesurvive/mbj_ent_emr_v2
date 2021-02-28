import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faEye,
  faTrashAlt,
  faHighlighter,
  faExclamation,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

import './UserItem.css';

const AttendanceItem = props => {

  let liClass;
  if (props.attendance.highlighted === false) {
    liClass = 'cardBody';
  } else {
    liClass = 'cardBodyHighlighted';
  }

  const [state, setState] = useState(false);
  const handleStateChange = () => {
    if (state === true) {
      setState(false);
    }
    if (state === false) {
      setState(true);
    }
   }

   const [deleteState, setDeleteState] = useState(false);
   const handleDeleteStateChange = () => {
     if (deleteState === true) {
       setDeleteState(false);
     }
     if (deleteState === false) {
       setDeleteState(true);
     }
    }

  return (
    <li key={props.key} className="">
      <Card>
        <Card.Body className={liClass}>
          {props.attendance.date.length === 12 && (
            <Card.Text className="cardText">
            Date: <span className="bold">{moment.unix(props.attendance.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}
          {props.attendance.date.length === 13 && (
            <Card.Text className="cardText">
            Date: <span className="bold">{moment.unix(props.attendance.date.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}

          <Card.Text className="cardText">
            Status: <span className="bold">{props.attendance.status}</span>
          </Card.Text>

          <OverlayTrigger
            placement={'right'}
            overlay={
              <Popover id={`popover-positioned-${'right'}`}>
                <Popover.Content>
                  <strong>More Info</strong>
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          </OverlayTrigger>


          <OverlayTrigger
            placement={'top'}
            overlay={
              <Popover id={`popover-positioned-${'top'}`}>
                <Popover.Content>
                  <strong>Toggle Highlight</strong>
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleStaffAttendanceHighlighted.bind(this, props.attendance)}/>
          </OverlayTrigger>

          {
          //   props.canUpdate === true && (
          //   <OverlayTrigger
          //     placement={'top'}
          //     overlay={
          //       <Popover id={`popover-positioned-${'top'}`}>
          //         <Popover.Content>
          //           <strong>Edit</strong>
          //         </Popover.Content>
          //       </Popover>
          //     }
          //   >
          //     <FontAwesomeIcon icon={faEdit} className="listIcon" onClick={props.startUpdate.bind(this, {field: 'attendance', data: props.attendance})}/>
          //   </OverlayTrigger>
          // )
        }

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              {props.attendance.date.length === 12 && (
                <Card.Text className="cardText">
                Date: <span className="bold">{moment.unix(props.attendance.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              {props.attendance.date.length === 13 && (
                <Card.Text className="cardText">
                Date: <span className="bold">{moment.unix(props.attendance.date.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              </li>
              <li>
              <Card.Text className="cardText">
                Status: <span className="bold">{props.attendance.status}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.attendance.description}</span>
              </Card.Text>
              </li>
              {props.canDelete === true && (
                <li>
                <OverlayTrigger
                  placement={'right'}
                  overlay={
                    <Popover id={`popover-positioned-${'right'}`}>
                      <Popover.Content>
                        <strong>Delete!?</strong>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
                </OverlayTrigger>

                </li>
              )}
              {deleteState === true && (
                <li>
                <Row className="listItemHiddenRow">
                  {props.canDelete && (
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.attendance)}>Delete</Button>
                  )}
                </Row>
                </li>
              )}
            </ul>
            </Row>
          )}

        </Card.Body>
      </Card>
    </li>
  )
}

export default AttendanceItem;
