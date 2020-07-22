import React from 'react';

import AttendanceItem from '../../items/user/AttendanceItem';
import './UserList.css';

const UserAttendanceList = props => {

  const {...filter} = props.filter;
  let attendance2 = props.attendance;
  let propsAttendance = [];

  if (filter.field === 'attendance' && filter.key === 'date' && filter.value === 'Ascending') {
    propsAttendance = attendance2.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }
  if (filter.field === 'attendance' && filter.key === 'status' && filter.value === 'Descending') {
    propsAttendance = attendance2.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }
  if (filter.field === 'attendance' && filter.key === 'status' && filter.value === 'Ascending') {
    propsAttendance = attendance2.sort((a, b) => (a.status > b.status) ? 1 : -1);
  }
  if (filter.field === 'attendance' && filter.key === 'status' && filter.value === 'Descending') {
    propsAttendance = attendance2.sort((a, b) => (a.status < b.status) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'attendance') {
    propsAttendance = attendance2;
  }

  let count = 0;

  const attendance = propsAttendance.map(attendanceItem => {

    count = propsAttendance.indexOf(attendanceItem)+1;

    return (
      <AttendanceItem
        key={count}
        attendance={attendanceItem}
      />
    );
  });

  return <ul className="attendanceList">{attendance}</ul>;
};

export default UserAttendanceList;
