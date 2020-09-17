import React from 'react';

import ComorbidityItem from '../../items/patient/ComorbidityItem';
import './UserList.css';

const PatientComorbidityList = props => {

  const {...filter} = props.filter;
  let comorbidity2 = props.comorbidities;
  let propsComormidity = [];

  if (filter.field === 'comorbidity' && filter.key === 'title' && filter.value === 'Ascending') {
    propsComormidity = comorbidity2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'comorbidity' && filter.key === 'title' && filter.value === 'Descending') {
    propsComormidity = comorbidity2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'comorbidity' && filter.key === 'type' && filter.value === 'Ascending') {
    propsComormidity = comorbidity2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'comorbidity' && filter.key === 'type' && filter.value === 'Descending') {
    propsComormidity = comorbidity2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  // if (filter.field === 'nextOfKin' && filter.key === 'primary') {
  //   propsNextOfKin = nextOfKin2.filter(x => x.primary === filter.value);
  // }
  if (filter.field !== 'comorbidity') {
    propsComormidity = comorbidity2;
  }

  let count = 0;

  const comorbidities = propsComormidity.map(comorbidityItem => {
    count = propsComormidity.indexOf(comorbidityItem)+1;

    return (
      <ComorbidityItem
        key={count}
        comorbidity={comorbidityItem}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="addressList">{comorbidities}</ul>;
};

export default PatientComorbidityList;
