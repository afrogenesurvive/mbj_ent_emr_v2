import React from 'react';

import ComplaintItem from '../../items/visit/ComplaintItem';
import './visitList.css';

const VisitComplaintList = props => {

  const {...filter} = props.filter;
  let complaints2 = props.complaints;
  let propsComplaints = [];

  if (filter.field === 'complaint' && filter.key === 'title' && filter.value === 'Ascending') {
    propsComplaints = complaints2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'complaint' && filter.key === 'title' && filter.value === 'Descending') {
    propsComplaints = complaints2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'complaint' && filter.key === 'description' && filter.value === 'Ascending') {
    propsComplaints = complaints2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'complaint' && filter.key === 'description' && filter.value === 'Descending') {
    propsComplaints = complaints2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  if (filter.field === 'complaint' && filter.key === 'anamnesis' && filter.value === 'Ascending') {
    propsComplaints = complaints2.sort((a, b) => (a.anamnesis > b.anamnesis) ? 1 : -1);
  }
  if (filter.field === 'complaint' && filter.key === 'anamnesis' && filter.value === 'Descending') {
    propsComplaints = complaints2.sort((a, b) => (a.anamnesis < b.anamnesis) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'complaint') {
    propsComplaints = complaints2;
  }

  let count = 0;

  const complaints = propsComplaints.map(complaint => {

    count = propsComplaints.indexOf(complaint)+1;

    return (
      <ComplaintItem
        key={count}
        complaint={complaint}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
      />
    );
  });

  return <ul className="visitList">{complaints}</ul>;
};

export default VisitComplaintList;
