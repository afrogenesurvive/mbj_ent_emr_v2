import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
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
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

import './UserItem.css';

const AddressItem = props => {

  let liClass;
  if (props.address.primary === false) {
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
          <Card.Text className="cardText">
            Town: <span className="bold">{props.address.town}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Country: <span className="bold">{props.address.country}</span>
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

          {props.canUpdate === true && (
            <OverlayTrigger
              key={'top'}
              placement={'top'}
              overlay={
                <Popover id={`popover-positioned-${'top'}`}>
                  <Popover.Content>
                    <strong>Edit</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faEdit} className="listIcon" onClick={props.startUpdate.bind(this, {field: 'address', data: props.address})}/>
            </OverlayTrigger>
          )}

          {state === true && (
            <Row className="listItemHiddenRow">
            <ul>
              <li>
              <Card.Text className="cardText">
                No: <span className="bold">{props.address.number}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Street: <span className="bold">{props.address.street}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Town: <span className="bold">{props.address.town}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                City: <span className="bold">{props.address.city}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Parish: <span className="bold">{props.address.parish}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Country: <span className="bold">{props.address.country}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Postal Code: <span className="bold">{props.address.postalCode}</span>
              </Card.Text>
              </li>
              <li>
              <Card.Text className="cardText">
                Primary: <span className="bold"> {props.address.primary === true && (<FontAwesomeIcon icon={faCheckSquare} className="listIcon"/>)} {props.address.primary === false && (<FontAwesomeIcon icon={faBan} className="listIcon"/>)}</span>
              </Card.Text>
              </li>
              {props.makePrimary && (
                <li>
                <Button variant="outline-primary" onClick={props.makePrimary.bind(this, props.address)}>Set Primary</Button>
                </li>
              )}
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
                    <Button variant="outline-danger" onClick={props.onDelete.bind(this, props.address)}>Delete</Button>
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

export default AddressItem;
