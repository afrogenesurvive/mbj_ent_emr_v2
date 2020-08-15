import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
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
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import QueueSlotList from '../../lists/queue/QueueSlotList';

import './queueItem.css';

const QueueItem = props => {

  const [state, setState] = useState(false);
  const handleStateChange = () => {
    if (state === true) {
      setState(false);
    }
    if (state === false) {
      setState(true);
    }
   }


  return (
    <div className="itemDiv">
      <Card>
        <Card.Body className="cardBody">
          <Card.Text className="cardText">
            Date: {moment.unix(props.queue.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}
          </Card.Text>
          <Card.Text className="cardText">
            Creator: {props.queue.creator.username}
          </Card.Text>

          <QueueSlotList
          queueSlots={props.queue.slots}
          />

        </Card.Body>
      </Card>
    </div>
  )
};

export default QueueItem;
