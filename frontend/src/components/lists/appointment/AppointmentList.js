import React from 'react';
import AppointmentItem from '../../items/appointment/AppointmentItem';
import './AppointmentList.css'

const AppointmentList = props => {

  const {...filter} = props.filter;
  let appointments2 = props.appointments;
  let propsAppointments = [];

  if (filter.field === 'appointment' && filter.key === 'title' && filter.value === 'Ascending') {
    propsAppointments = appointments2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'title' && filter.value === 'Descending') {
    propsAppointments = appointments2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'type' && filter.value === 'Ascending') {
    propsAppointments = appointments2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'type' && filter.value === 'Descending') {
    propsAppointments = appointments2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'subType' && filter.value === 'Ascending') {
    propsAppointments = appointments2.sort((a, b) => (a.subType > b.subType) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'subType' && filter.value === 'Descending') {
    propsAppointments = appointments2.sort((a, b) => (a.subType < b.subType) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'date' && filter.value === 'Ascending') {
    propsAppointments = appointments2.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'date' && filter.value === 'Descending') {
    propsAppointments = appointments2.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'time' && filter.value === 'Ascending') {
    propsAppointments = appointments2.sort((a, b) => (a.time > b.time) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'time' && filter.value === 'Descending') {
    propsAppointments = appointments2.sort((a, b) => (a.time < b.time) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'location' && filter.value === 'Ascending') {
    propsAppointments = appointments2.sort((a, b) => (a.location > b.location) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'location' && filter.value === 'Descending') {
    propsAppointments = appointments2.sort((a, b) => (a.location < b.location) ? 1 : -1);
  }
  if (filter.field === 'appointment' && filter.key === 'important') {
    propsAppointments = appointments2.filter(x => x.important === filter.value);
  }
  if (filter.field === 'appointment' && filter.key === 'inProgress') {
    propsAppointments = appointments2.filter(x => x.inProgress === filter.value);
  }
  if (filter.field === 'appointment' && filter.key === 'attended') {
    propsAppointments = appointments2.filter(x => x.attended === filter.value);
  }

  if (filter.field !== 'appointment') {
    propsAppointments = appointments2;
  }

  let count = 0;

  const appointments = propsAppointments.map(appointment=> {

    count = propsAppointments.indexOf(appointment+1);

    return (
      <AppointmentItem
        key={count}
        appointment={appointment}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        showDetails={props.showDetails}
        visitPage={props.visitPage}
        onSelect={props.onSelect}
      />
    );
  });

  return <ul className="userList">{appointments}</ul>;
};

export default AppointmentList;
