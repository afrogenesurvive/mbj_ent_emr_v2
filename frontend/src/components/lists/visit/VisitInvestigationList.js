import React from 'react';

import InvestigationItem from '../../items/visit/InvestigationItem';
import './visitList.css';

const VisitInvestigationList = props => {

  const {...filter} = props.filter;
  let investigations2 = props.investigation;
  let propsInvestigations = [];

  if (filter.field === 'investigation' && filter.key === 'title' && filter.value === 'Ascending') {
    propsInvestigations = investigations2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'investigation' && filter.key === 'title' && filter.value === 'Descending') {
    propsInvestigations = investigations2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'investigation' && filter.key === 'description' && filter.value === 'Ascending') {
    propsInvestigations = investigations2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'investigation' && filter.key === 'description' && filter.value === 'Descending') {
    propsInvestigations = investigations2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field === 'investigation' && filter.key === 'highlighted') {
    propsInvestigations = investigations2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'investigation') {
    propsInvestigations = investigations2;
  }

  let count = 0;

  const investigations = propsInvestigations.map(investigation => {

    count = propsInvestigations.indexOf(investigation)+1;

    return (
      <InvestigationItem
        key={count}
        investigation={investigation}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
        toggleVisitInvestigationHighlighted={props.toggleVisitInvestigationHighlighted}
        canUpdate={props.canUpdate}
        startUpdate={props.startUpdate}
      />
    );
  });

  return <ul className="visitList">{investigations}</ul>;
};

export default VisitInvestigationList;
