import React from 'react';

import PatientItem from '../../items/patient/PatientItem';
import './UserList.css';

const PatientList = props => {

  const {...filter} = props.filter;
  let patients2 = props.patients;
  let propsPatients = [];

  if (filter.field === 'patient' && filter.key === 'name' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'name' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'username' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.username > b.username) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'username' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.username < b.username) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'title' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'title' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'role' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.role > b.role) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'role' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.role < b.role) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'dob' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.dob > b.dob) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'dob' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.dob < b.dob) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'age' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.age > b.age) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'age' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.age < b.age) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'gender' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.gender > b.gender) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'gender' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.gender < b.gender) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'registration.date' && filter.value === 'Ascending') {
    propsPatients = patients2.sort((a, b) => (a.registration.date > b.registration.date) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'registration.date' && filter.value === 'Descending') {
    propsPatients = patients2.sort((a, b) => (a.registration.date < b.registration.date) ? 1 : -1);
  }
  if (filter.field === 'patient' && filter.key === 'loggedIn') {
    propsPatients = patients2.filter(x => x.loggedIn === filter.value);
  }
  if (filter.field === 'patient' && filter.key === 'active') {
    propsPatients = patients2.filter(x => x.active === filter.value);
  }

  if (filter.field !== 'patient') {
    propsPatients = patients2;
  }

  let count = 0;

  const patients = propsPatients.map(patient => {

    count = propsPatients.indexOf(patient)+1;

    return (
      <PatientItem
        key={count}
        count={count}
        patient={patient}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        showDetails={props.showDetails}
        appointmentPage={props.appointmentPage}
        homePage={props.homePage}
        onSelect={props.onSelect}
      />
    );
  });

  return <ul className="userList">{patients}</ul>;
};

export default PatientList;
