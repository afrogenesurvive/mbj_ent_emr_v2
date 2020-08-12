import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import './UserItem.css';

const LeaveItem = props => {
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
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Start: <span className="bold">{moment.unix(props.leave.startDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                Type: <span className="bold">{props.leave.type}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Start: <span className="bold">{moment.unix(props.leave.startDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                End: <span className="bold">{moment.unix(props.leave.endDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Description: <span className="bold">{props.leave.description}</span>
              </Card.Text>
              </li>
              {props.canDelete === true && (
                <li>
                <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
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
