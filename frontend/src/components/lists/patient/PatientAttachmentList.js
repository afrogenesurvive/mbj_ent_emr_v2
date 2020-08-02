import React from 'react';

import AttachmentItem from '../../items/patient/AttachmentItem';
import './UserList.css';

const PatientAttachmentList = props => {

  let count = 0;

  const attachments = props.attachments.map(attachment => {
    count = props.attachments.indexOf(attachment)+1;

    return (
      <AttachmentItem
        key={count}
        item={props.item}
        attachment={attachment}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        type={props.type}
      />
    );
  });

  return <ul className="addressList">{attachments}</ul>;
};

export default PatientAttachmentList;
