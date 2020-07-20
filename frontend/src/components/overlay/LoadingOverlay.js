import React from 'react';
import Button from 'react-bootstrap/Button';

import "./loadingOverlay.css"

const LoadingOveray = (props) =>{

return (
  <div className="attachmentViewerBg">
    <div className="loadingOverlay">
      <h5 className="attachmentViewerTitle">status : {props.status} ...</h5>
      {props.toggleOverlay && (
        <Button className="sidebarButton" variant="warning" onClick={props.toggleOverlay}>X</Button>
      )}

    </div>
  </div>
)

}


export default LoadingOveray;
