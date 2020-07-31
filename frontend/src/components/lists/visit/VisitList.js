import React from 'react';

import VisitItem from '../../items/visit/VisitItem';
import './visitList.css';

const VisitList = props => {

  const {...filter} = props.filter;
  let visits2 = props.visits;
  let propsVisits = [];

  if (filter.field === 'visit' && filter.key === 'title' && filter.value === 'Ascending') {
    propsVisits = visits2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'title' && filter.value === 'Descending') {
    propsVisits = visits2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'date' && filter.value === 'Ascending') {
    propsVisits = visits2.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'date' && filter.value === 'Descending') {
    propsVisits = visits2.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'time' && filter.value === 'Ascending') {
    propsVisits = visits2.sort((a, b) => (a.time > b.time) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'time' && filter.value === 'Descending') {
    propsVisits = visits2.sort((a, b) => (a.time < b.time) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'type' && filter.value === 'Ascending') {
    propsVisits = visits2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'type' && filter.value === 'Descending') {
    propsVisits = visits2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'subType' && filter.value === 'Ascending') {
    propsVisits = visits2.sort((a, b) => (a.subType > b.subType) ? 1 : -1);
  }
  if (filter.field === 'visit' && filter.key === 'subType' && filter.value === 'Descending') {
    propsVisits = visits2.sort((a, b) => (a.subType < b.subType) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'visit') {
    propsVisits = visits2;
  }

  let count = 0;

  const visits = propsVisits.map(visit => {

    count = propsVisits.indexOf(visit)+1;

    return (
      <VisitItem
        key={count}
        visit={visit}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        showDetails={props.showDetails}
      />
    );
  });

  return <ul className="visitList">{visits}</ul>;
};

export default VisitList;
