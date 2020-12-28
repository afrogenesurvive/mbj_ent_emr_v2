import React from 'react';

import DiagnosisItem from '../../items/visit/DiagnosisItem';
import './visitList.css';

const VisitDiagnosisList = props => {

  const {...filter} = props.filter;
  let diagnosis2 = props.diagnosis;
  let propsDiagnosis = [];

  if (filter.field === 'diagnosis' && filter.key === 'title' && filter.value === 'Ascending') {
    propsDiagnosis = diagnosis2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'diagnosis' && filter.key === 'title' && filter.value === 'Descending') {
    propsDiagnosis = diagnosis2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'diagnosis' && filter.key === 'type' && filter.value === 'Ascending') {
    propsDiagnosis = diagnosis2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'diagnosis' && filter.key === 'type' && filter.value === 'Descending') {
    propsDiagnosis = diagnosis2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'diagnosis' && filter.key === 'description' && filter.value === 'Ascending') {
    propsDiagnosis = diagnosis2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'diagnosis' && filter.key === 'description' && filter.value === 'Descending') {
    propsDiagnosis = diagnosis2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field === 'diagnosis' && filter.key === 'highlighted') {
    propsDiagnosis = diagnosis2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'diagnosis') {
    propsDiagnosis = diagnosis2;
  }

  let count = 0;

  const diagnoses = propsDiagnosis.map(diagnosis => {

    count = propsDiagnosis.indexOf(diagnosis)+1;

    return (
      <DiagnosisItem
        key={count}
        diagnosis={diagnosis}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
        toggleVisitDiagnosisHighlighted={props.toggleVisitDiagnosisHighlighted}
      />
    );
  });

  return <ul className="visitList">{diagnoses}</ul>;
};

export default VisitDiagnosisList;
