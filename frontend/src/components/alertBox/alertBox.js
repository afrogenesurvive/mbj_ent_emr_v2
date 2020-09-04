import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinusSquare,
  faPlusSquare
} from '@fortawesome/free-solid-svg-icons';

import './alertBox.css'

const AlertBox = (props) => {
  let alert = "Alerts shown here";

  if (props.alert !== null) {
    alert = '"'+props.alert+'"';
  }
  const [state, setState] = useState('alertBoxOpen');
  const handleStateChange = () => {
    console.log('foooo');
    if (state === 'alertBoxClosed') {
      setState('alertBoxOpen');
    }
    if (state === 'alertBoxOpen') {
      setState('alertBoxClosed');
    }
   }

return (
  <div className={state}>
  {state === 'alertBoxOpen' ? (
    <FontAwesomeIcon icon={faMinusSquare} className="listIcon" onClick={handleStateChange}/>
  ):(
    <FontAwesomeIcon icon={faPlusSquare} className="listIcon" onClick={handleStateChange}/>
  )}

  <Alert variant="warning">
  <p className="alertBoxText">{alert}</p>
  </Alert>
  </div>
)

}

export default AlertBox;
