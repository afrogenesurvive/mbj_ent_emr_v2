import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
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
  faUserPlus,
  faCalendarPlus
} from '@fortawesome/free-solid-svg-icons';
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


          {!props.appointmentPage &&
            !props.visitPage &&
            props.showDetails && (
              <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                  <Popover id={`popover-positioned-${'top'}`}>
                    <Popover.Content>
                      <strong>Go To Staff Details</strong>
                    </Popover.Content>
                  </Popover>
                }
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon" onClick={props.showDetails.bind(this, props.user)}/>
              </OverlayTrigger>

          )}

          {props.appointmentPage && (
            <Link
              to={{
                pathname: "/staff",
                state: {user: props.user._id}
              }}
            >
            <OverlayTrigger
              key={'top'}
              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Go To Staff Details</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
            </OverlayTrigger>

            </Link>
          )}

          {props.visitPage && (
            <Link
              to={{
                pathname: "/staff",
                state: {user: props.user._id}
              }}
            >
            <OverlayTrigger
              key={'top'}
              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Go To Staff Details</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
            </OverlayTrigger>

            </Link>
          )}

          {props.selectUser && (
            <OverlayTrigger
              key={'top'}
              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Select/Add User</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faUserPlus} className="listIcon" onClick={props.selectUser.bind(this, props.user)}/>
            </OverlayTrigger>

          )}

          {props.canDelete && (
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

            </ul>
            </Row>
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
