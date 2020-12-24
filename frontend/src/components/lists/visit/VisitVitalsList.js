import React from 'react';

import VitalsItem from '../../items/visit/VitalsItem';
import './visitList.css';

const VisitVitalsList = props => {

  const {...filter} = props.filter;
  let vitals2 = props.vitals;
  let propsVitals = [];

  if (filter.field === 'vitals' && filter.key === 'pr' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.pr > b.pr) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'pr' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.pr < b.pr) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'bp1' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.bp1 > b.bp1) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'bp1' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.bp1 < b.bp1) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'bp2' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.bp2 > b.bp2) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'bp2' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.bp2 < b.bp2) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'rr' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.rr > b.rr) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'rr' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.rr < b.rr) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'temp' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.temp > b.temp) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'temp' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.temp < b.temp) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'sp02' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.sp02 > b.sp02) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'sp02' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.sp02 < b.sp02) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'heightValue' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.heightValue > b.heightValue) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'heightValue' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.heightValue < b.heightValue) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'weightValue' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.weightValue > b.weightValue) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'weightValue' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.weightValue < b.weightValue) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'bmi' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.bmi > b.bmi) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'bmi' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.bmi < b.bmi) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'urine.type' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.urine.type > b.urine.type) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'urine.type' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.urine.type < b.urine.type) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'urine.value' && filter.value === 'Ascending') {
    propsVitals = vitals2.sort((a, b) => (a.urine.value > b.urine.value) ? 1 : -1);
  }
  if (filter.field === 'vitals' && filter.key === 'urine.value' && filter.value === 'Descending') {
    propsVitals = vitals2.sort((a, b) => (a.urine.value < b.urine.value) ? 1 : -1);
  }
  // if (filter.field === 'vitals' && filter.key === 'role') {
  //   propsVitals = vitals2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'vitals') {
    propsVitals = vitals2;
  }

  let count = 0;

  const vitals = propsVitals.map(vitalsItem => {

    count = propsVitals.indexOf(vitalsItem)+1;

    return (
      <VitalsItem
        key={count}
        vitals={vitalsItem}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
      />
    );
  });

  return <ul className="visitList">{vitals}</ul>;
};

export default VisitVitalsList;
