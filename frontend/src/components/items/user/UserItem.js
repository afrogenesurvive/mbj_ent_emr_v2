import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import './UserItem.css';

const UserItem = (props) => {

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
    <li key={props.key} className="userItemLi">
      <Card>
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Username: <span className="bold">{props.user.username}</span>
          </Card.Text>
          <Card.Text className="cardText">
            role: <span className="bold">{props.user.role}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
          {props.canDelete && (
            <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
          )}

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                id: <span className="bold">{props.user._id}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                name: <span className="bold">{props.user.name}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                username: <span className="bold">{props.user.username}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                title: <span className="bold">{props.user.title}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                role: <span className="bold">{props.user.role}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                dob: <span className="bold">{moment.unix(props.user.dob.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                age: <span className="bold">{props.user.age}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                gender: <span className="bold">{props.user.gender}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                loggedIn: <span className="bold">{props.user.loggedIn === true && (<FontAwesomeIcon icon={faBatteryThreeQuarters} className="listIcon"/>)} {props.user.loggedIn === false && (<FontAwesomeIcon icon={faBatteryEmpty} className="listIcon"/>)}</span>
              </Card.Text>
              </li>
              {!props.appointmentPage &&
                !props.visitPage && (
                  <li>
                  <Button variant="outline-primary" onClick={props.showDetails.bind(this, props.user)}>Details</Button>
                  </li>
              )}
              {props.appointmentPage && (
                <li>
                <Link
                  to={{
                    pathname: "/staff",
                    state: {user: props.user._id}
                  }}
                >Go!
                </Link>
                </li>
              )}
              {props.visitPage && (
                <li>
                <Link
                  to={{
                    pathname: "/staff",
                    state: {user: props.user._id}
                  }}
                >Go!
                </Link>
                </li>
              )}
            </ul>
            </Row>
          )}
          {props.selectUser && (
            <Button variant="outline-primary" onClick={props.selectUser.bind(this, props.user)}>Add</Button>
          )}
          {deleteState === true && (
            <Row className="listItemHiddenRow">
              {props.canDelete && (
                <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.user)}>Delete</Button>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    </li>
  )
};

export default UserItem;
