import React from 'react';

import AllergyItem from '../../items/patient/AllergyItem';
import './UserList.css';

const PatientAllergyList = props => {

  const {...filter} = props.filter;
  let allergies2 = props.allergies;
  let propsAllergies = [];

  if (filter.field === 'allergy' && filter.key === 'title' && filter.value === 'Ascending') {
    propsAllergies = allergies2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'allergy' && filter.key === 'title' && filter.value === 'Descending') {
    propsAllergies = allergies2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'allergy' && filter.key === 'type' && filter.value === 'Ascending') {
    propsAllergies = allergies2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'allergy' && filter.key === 'type' && filter.value === 'Descending') {
    propsAllergies = allergies2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  // if (filter.field === 'nextOfKin' && filter.key === 'primary') {
  //   propsNextOfKin = nextOfKin2.filter(x => x.primary === filter.value);
  // }
  if (filter.field !== 'allergy') {
    propsAllergies = allergies2;
  }

  let count = 0;

  const allergies = propsAllergies.map(allergy => {
    count = propsAllergies.indexOf(allergy)+1;

    return (
      <AllergyItem
        key={count}
        allergy={allergy}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
        visitPage={props.visitPage}
      />
    );
  });

  return <ul className="addressList">{allergies}</ul>;
};

export default PatientAllergyList;
