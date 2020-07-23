import React from 'react';

import LeaveItem from '../../items/user/LeaveItem';
import './UserList.css';

const UserLeaveList = props => {

  const {...filter} = props.filter;
  let leave2 = props.leave;
  let propsLeave = [];

  if (filter.field === 'leave' && filter.key === 'type' && filter.value === 'Ascending') {
    propsLeave = leave2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'leave' && filter.key === 'type' && filter.value === 'Descending') {
    propsLeave = leave2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'leave' && filter.key === 'startDate' && filter.value === 'Ascending') {
    propsLeave = leave2.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);
  }
  if (filter.field === 'leave' && filter.key === 'startDate' && filter.value === 'Descending') {
    propsLeave = leave2.sort((a, b) => (a.startDate < b.startDate) ? 1 : -1);
  }
  if (filter.field === 'leave' && filter.key === 'endDate' && filter.value === 'Ascending') {
    propsLeave = leave2.sort((a, b) => (a.endDate > b.endDate) ? 1 : -1);
  }
  if (filter.field === 'leave' && filter.key === 'endDate' && filter.value === 'Descending') {
    propsLeave = leave2.sort((a, b) => (a.endDate < b.endDate) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'leave') {
    propsLeave = leave2;
  }

  let count = 0;

  const leave = propsLeave.map(leaveItem => {

    count = propsLeave.indexOf(leaveItem)+1;

    return (
      <LeaveItem
        key={count}
        leave={leaveItem}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="leaveList">{leave}</ul>;
};

export default UserLeaveList;
