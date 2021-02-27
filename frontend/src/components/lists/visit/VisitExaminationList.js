import React from 'react';

import ExaminationItem from '../../items/visit/ExaminationItem';
import './visitList.css';

const VisitExaminationList = props => {

  const {...filter} = props.filter;
  let examinations2 = props.examination;
  let propsExaminations = [];

  if (filter.field === 'examination' && filter.key === 'general' && filter.value === 'Ascending') {
    propsExaminations = examinations2.sort((a, b) => (a.general > b.general) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'general' && filter.value === 'Descending') {
    propsExaminations = examinations2.sort((a, b) => (a.general < b.general) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'area' && filter.value === 'Ascending') {
    propsExaminations = examinations2.sort((a, b) => (a.area > b.area) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'area' && filter.value === 'Descending') {
    propsExaminations = examinations2.sort((a, b) => (a.area < b.area) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'inspection' && filter.value === 'Ascending') {
    propsExaminations = examinations2.sort((a, b) => (a.inspection > b.inspection) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'inspection' && filter.value === 'Descending') {
    propsExaminations = examinations2.sort((a, b) => (a.inspection < b.inspection) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'palpation' && filter.value === 'Ascending') {
    propsExaminations = examinations2.sort((a, b) => (a.palpation > b.palpation) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'palpation' && filter.value === 'Descending') {
    propsExaminations = examinations2.sort((a, b) => (a.palpation < b.palpation) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'percussion' && filter.value === 'Ascending') {
    propsExaminations = examinations2.sort((a, b) => (a.percussion > b.percussion) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'percussion' && filter.value === 'Descending') {
    propsExaminations = examinations2.sort((a, b) => (a.percussion < b.percussion) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'auscultation' && filter.value === 'Ascending') {
    propsExaminations = examinations2.sort((a, b) => (a.auscultation > b.auscultation) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'auscultation' && filter.value === 'Descending') {
    propsExaminations = examinations2.sort((a, b) => (a.auscultation < b.auscultation) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'description' && filter.value === 'Ascending') {
    propsExaminations = examinations2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'description' && filter.value === 'Descending') {
    propsExaminations = examinations2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  if (filter.field === 'examination' && filter.key === 'followUp') {
    propsExaminations = examinations2.filter(x => x.followUp === filter.value);
  }
  if (filter.field === 'examination' && filter.key === 'highlighted') {
    propsExaminations = examinations2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'examination') {
    propsExaminations = examinations2;
  }

  let count = 0;

  const examinations = propsExaminations.map(examination => {

    count = propsExaminations.indexOf(examination)+1;

    return (
      <ExaminationItem
        key={count}
        examination={examination}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
        toggleVisitExaminationHighlighted={props.toggleVisitExaminationHighlighted}
        canUpdate={props.canUpdate}
        startUpdate={props.startUpdate}
      />
    );
  });

  return <ul className="visitList">{examinations}</ul>;
};

export default VisitExaminationList;
