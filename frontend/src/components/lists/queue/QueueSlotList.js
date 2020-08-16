import React from 'react';

import QueueSlotItem from '../../items/queue/QueueSlotItem';
import './queueSlotList.css';

const QueueSlotList = props => {

  let count = 0;

  const queueSlots = props.queueSlots.map(queueSlot => {
    count = props.queueSlots.indexOf(queueSlot)+1;

    return (
      <QueueSlotItem
        key={count}
        queueSlot={queueSlot}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        slotSeen={props.slotSeen}
        slotUnseen={props.slotUnseen}
      />
    );
  });

  return <ul className="userList">{queueSlots}</ul>;
};

export default QueueSlotList;
