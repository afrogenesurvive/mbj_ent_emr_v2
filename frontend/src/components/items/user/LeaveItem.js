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
  faExclamation
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

import './UserItem.css';

const LeaveItem = props => {

  let liClass;
  if (props.leave.highlighted === false) {
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
          {props.leave.startDate.length === 12 && (
            <Card.Text className="cardText">
              Start: <span className="bold">{moment.unix(props.leave.startDate.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}
          {props.leave.startDate.length === 13 && (
            <Card.Text className="cardText">
              Start: <span className="bold">{moment.unix(props.leave.startDate.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}

          {props.leave.endDate.length === 12 && (
            <Card.Text className="cardText">
              End: <span className="bold">{moment.unix(props.leave.endDate.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}
          {props.leave.endDate.length === 13 && (
            <Card.Text className="cardText">
              End: <span className="bold">{moment.unix(props.leave.endDate.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
            </Card.Text>
          )}

          <OverlayTrigger
            key={'top'}
            placement={'top'}
            overlay={
              <Popover id={`popover-positioned-${'top'}`}>
                <Popover.Content>
                  <strong>More Info</strong>
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          </OverlayTrigger>


          <OverlayTrigger
            key={'top'}
            placement={'top'}
            overlay={
              <Popover id={`popover-positioned-${'top'}`}>
                <Popover.Content>
                  <strong>Toggle Highlight</strong>
                </Popover.Content>
              </Popover>
            }
          >
            <FontAwesomeIcon icon={faHighlighter} className="listIcon" onClick={props.toggleStaffLeaveHighlighted.bind(this, props.leave)}/>
          </OverlayTrigger>


          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.leave.type}</span>
              </Card.Text>
              </li>
              <li>
              {props.leave.startDate.length === 12 && (
                <Card.Text className="cardText">
                  Start: <span className="bold">{moment.unix(props.leave.startDate.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              {props.leave.startDate.length === 13 && (
                <Card.Text className="cardText">
                  Start: <span className="bold">{moment.unix(props.leave.startDate.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              </li>
              <li>
              {props.leave.endDate.length === 12 && (
                <Card.Text className="cardText">
                  End: <span className="bold">{moment.unix(props.leave.endDate.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              {props.leave.endDate.length === 13 && (
                <Card.Text className="cardText">
                  End: <span className="bold">{moment.unix(props.leave.endDate.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</span>
                </Card.Text>
              )}
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.leave.description}</span>
              </Card.Text>
              </li>
              {props.canDelete === true && (
                <li>

                <OverlayTrigger
                  key={'top'}
                  placement={'top'}
                  overlay={
                    <Popover id={`popover-positioned-${'top'}`}>
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
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.leave)}>Delete</Button>
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
};

export default LeaveItem;
