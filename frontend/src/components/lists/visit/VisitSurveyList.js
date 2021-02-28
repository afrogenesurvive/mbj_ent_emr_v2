import React from 'react';

import SurveyItem from '../../items/visit/SurveyItem';
import './visitList.css';

const VisitSurveyList = props => {

  const {...filter} = props.filter;
  let surveys2 = props.surveys;
  let propsSurveys = [];

  if (filter.field === 'survey' && filter.key === 'title' && filter.value === 'Ascending') {
    propsSurveys = surveys2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'survey' && filter.key === 'title' && filter.value === 'Descending') {
    propsSurveys = surveys2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'survey' && filter.key === 'description' && filter.value === 'Ascending') {
    propsSurveys = surveys2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'survey' && filter.key === 'description' && filter.value === 'Descending') {
    propsSurveys = surveys2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field === 'survey' && filter.key === 'highlighted') {
    propsSurveys = surveys2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'survey') {
    propsSurveys = surveys2;
  }

  let count = 0;

  const surveys = propsSurveys.map(survey => {

    count = propsSurveys.indexOf(survey)+1;

    return (
      <SurveyItem
        key={count}
        survey={survey}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
        toggleVisitSurveyHighlighted={props.toggleVisitSurveyHighlighted}
        canUpdate={props.canUpdate}
        startUpdate={props.startUpdate}
      />
    );
  });

  return <ul className="visitList">{surveys}</ul>;
};

export default VisitSurveyList;
