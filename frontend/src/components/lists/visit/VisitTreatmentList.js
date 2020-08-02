import React from 'react';

import TreatmentItem from '../../items/visit/TreatmentItem';
import './visitList.css';

const VisitTreatmentList = props => {

  const {...filter} = props.filter;
  let treatment2 = props.treatment;
  let propsTreatment = [];

  if (filter.field === 'treatment' && filter.key === 'title' && filter.value === 'Ascending') {
    propsTreatment = treatment2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'title' && filter.value === 'Descending') {
    propsTreatment = treatment2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'type' && filter.value === 'Ascending') {
    propsTreatment = treatment2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'type' && filter.value === 'Descending') {
    propsTreatment = treatment2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'dose' && filter.value === 'Ascending') {
    propsTreatment = treatment2.sort((a, b) => (a.dose > b.dose) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'dose' && filter.value === 'Descending') {
    propsTreatment = treatment2.sort((a, b) => (a.dose < b.dose) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'frequency' && filter.value === 'Ascending') {
    propsTreatment = treatment2.sort((a, b) => (a.frequency > b.frequency) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'frequency' && filter.value === 'Descending') {
    propsTreatment = treatment2.sort((a, b) => (a.frequency < b.frequency) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'description' && filter.value === 'Ascending') {
    propsTreatment = treatment2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'treatment' && filter.key === 'description' && filter.value === 'Descending') {
    propsTreatment = treatment2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'treatment') {
    propsTreatment = treatment2;
  }

  let count = 0;

  const treatments = propsTreatment.map(treatment => {

    count = propsTreatment.indexOf(treatment)+1;

    return (
      <TreatmentItem
        key={count}
        treatment={treatment}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
      />
    );
  });

  return <ul className="visitList">{treatments}</ul>;
};

export default VisitTreatmentList;
