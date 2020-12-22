import React from 'react';

import MedicationItem from '../../items/patient/MedicationItem';
import './UserList.css';

const PatientMedicationList = props => {
  console.log('foo3',props.visitPage);
  const {...filter} = props.filter;
  let medication2 = props.medication;
  let propsMedication = [];

  if (filter.field === 'medication' && filter.key === 'title' && filter.value === 'Ascending') {
    propsMedication = medication2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'medication' && filter.key === 'title' && filter.value === 'Descending') {
    propsMedication = medication2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'medication' && filter.key === 'type' && filter.value === 'Ascending') {
    propsMedication = medication2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'medication' && filter.key === 'type' && filter.value === 'Descending') {
    propsMedication = medication2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  // if (filter.field === 'nextOfKin' && filter.key === 'primary') {
  //   propsNextOfKin = nextOfKin2.filter(x => x.primary === filter.value);
  // }
  if (filter.field !== 'medication') {
    propsMedication = medication2;
  }

  let count = 0;

  const medication = propsMedication.map(medicationItem => {
    count = propsMedication.indexOf(medicationItem)+1;

    return (
      <MedicationItem
        key={count}
        medication={medicationItem}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
        visitPage={props.visitPage}
      />
    );
  });

  return <ul className="addressList">{medication}</ul>;
};

export default PatientMedicationList;
