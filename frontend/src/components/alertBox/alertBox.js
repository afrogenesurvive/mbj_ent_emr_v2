
import React from 'react';
import Alert from 'react-bootstrap/Alert'

import './alertBox.css'

const AlertBox = (props) => {
  let alert = "Alerts shown here";

  if (props.alert !== null) {
    alert = '"'+props.alert+'"';
  }

return (
  <div className="alertBox">
  <Alert variant="warning">
  <p className="alertBoxText">{alert}</p>
  </Alert>
  </div>
)

}

export default AlertBox;
