import React from 'react';

import ComorbidityItem from '../../items/patient/ComorbidityItem';
import './UserList.css';

const PatientComorbidityList = props => {

  const {...filter} = props.filter;
  let comorbidity2 = props.comorbidities;
  let propsComorbidity = [];

  if (filter.field === 'comorbidity' && filter.key === 'title' && filter.value === 'Ascending') {
    propsComorbidity = comorbidity2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'comorbidity' && filter.key === 'title' && filter.value === 'Descending') {
    propsComorbidity = comorbidity2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'comorbidity' && filter.key === 'type' && filter.value === 'Ascending') {
    propsComorbidity = comorbidity2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'comorbidity' && filter.key === 'type' && filter.value === 'Descending') {
    propsComorbidity = comorbidity2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  // if (filter.field === 'nextOfKin' && filter.key === 'primary') {
  //   propsNextOfKin = nextOfKin2.filter(x => x.primary === filter.value);
  // }
  if (filter.field === 'comorbidity' && filter.key === 'highlighted') {
    propsComorbidity = comorbidity2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'comorbidity') {
    propsComorbidity = comorbidity2;
  }

  let count = 0;

  const comorbidities = propsComorbidity.map(comorbidityItem => {
    count = propsComorbidity.indexOf(comorbidityItem)+1;

    return (
      <ComorbidityItem
        key={count}
        comorbidity={comorbidityItem}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        visitPage={props.visitPage}
        togglePatientComorbidityHighlighted={props.togglePatientComorbidityHighlighted}
      />
    );
  });

  return <ul className="addressList">{comorbidities}</ul>;
};

export default PatientComorbidityList;
