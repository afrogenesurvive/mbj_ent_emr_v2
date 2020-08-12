import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons';
import { faBatteryEmpty } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './UserItem.css';

const AddressItem = props => {
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
            Town: <span className="bold">{props.address.town}</span>
          </Card.Text>
          <Card.Text className="cardText">
            Country: <span className="bold">{props.address.country}</span>
          </Card.Text>
          <FontAwesomeIcon icon={faEye} className="listIcon" onClick={handleStateChange}/>
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
                Primary: <span className="bold"> {props.address.primary === true && (<FontAwesomeIcon icon={faBatteryThreeQuarters} className="listIcon"/>)} {props.address.primary === false && (<FontAwesomeIcon icon={faBatteryEmpty} className="listIcon"/>)}</span>
              </Card.Text>
              </li>
              {props.makePrimary && (
                <li>
                <Button variant="outline-primary" onClick={props.makePrimary.bind(this, props.address)}>Set Primary</Button>
                </li>
              )}
              {props.canDelete === true && (
                <li>
                <FontAwesomeIcon icon={faTrashAlt} className="listIcon" onClick={handleDeleteStateChange}/>
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
