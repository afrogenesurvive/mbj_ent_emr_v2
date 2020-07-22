import React from 'react';

import AppointmentItem from '../../items/user/AppointmentItem';
import './UserList.css';

const UserAppointmentList = props => {

  const {...filter} = props.filter;
  let appointments2 = props.appointments;
  let propsAppointments = [];

  // if (filter.field === 'userMasterList' && filter.key === 'username' && filter.value === 'Ascending') {
  //   propsAddresses = addresses2.sort((a, b) => (a.username > b.username) ? 1 : -1);
  // }
  // if (filter.field === 'userMasterList' && filter.key === 'username' && filter.value === 'Descending') {
  //   propsAddresses = addresses2.sort((a, b) => (a.username < b.username) ? 1 : -1);
  // }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'appointment') {
    propsAppointments = appointments2;
  }

  let count = 0;

  const appointments = propsAppointments.map(appointment => {

    count = propsAppointments.indexOf(appointment)+1;

    return (
      <AppointmentItem
        key={count}
        appointment={appointment}
      />
    );
  });

  return <ul className="appointmentList">{appointments}</ul>;
};

export default UserAppointmentList;
