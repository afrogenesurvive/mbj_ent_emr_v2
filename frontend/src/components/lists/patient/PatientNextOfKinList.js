import React from 'react';

import NextOfKinItem from '../../items/patient/NextOfKinItem';
import './UserList.css';

const PatientNextOfKinList = props => {

  const {...filter} = props.filter;
  let nextOfKin2 = props.nextOfKin;
  let propsNextOfKin = [];

  if (filter.field === 'nextOfKin' && filter.key === 'name' && filter.value === 'Ascending') {
    propsNextOfKin = nextOfKin2.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'nextOfKin' && filter.key === 'name' && filter.value === 'Descending') {
    propsNextOfKin = nextOfKin2.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'nextOfKin' && filter.key === 'relation' && filter.value === 'Ascending') {
    propsNextOfKin = nextOfKin2.sort((a, b) => (a.relation > b.relation) ? 1 : -1);
  }
  if (filter.field === 'nextOfKin' && filter.key === 'relation' && filter.value === 'Descending') {
    propsNextOfKin = nextOfKin2.sort((a, b) => (a.relation < b.relation) ? 1 : -1);
  }
  // if (filter.field === 'nextOfKin' && filter.key === 'primary') {
  //   propsNextOfKin = nextOfKin2.filter(x => x.primary === filter.value);
  // }
  if (filter.field === 'nextOfKin' && filter.key === 'highlighted') {
    propsNextOfKin = nextOfKin2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'nextOfKin') {
    propsNextOfKin = nextOfKin2;
  }

  let count = 0;

  const nextOfKin = propsNextOfKin.map(nextOfKinItem => {
    // console.log('nok',nextOfKinItem);
    count = propsNextOfKin.indexOf(nextOfKinItem)+1;

    return (
      <NextOfKinItem
        key={count}
        nextOfKin={nextOfKinItem}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        makePrimary={props.makePrimary}
        togglePatientNextOfKinHighlighted={props.togglePatientNextOfKinHighlighted}
      />
    );
  });

  return <ul className="addressList">{nextOfKin}</ul>;
};

export default PatientNextOfKinList;
