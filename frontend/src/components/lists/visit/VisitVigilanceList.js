import React from 'react';

import VigilanceItem from '../../items/visit/VigilanceItem';
import './visitList.css';

const VisitVigilanceList = props => {

  const {...filter} = props.filter;
  let vigilance2 = props.vigilance;
  let propsVigilance = [];

  if (filter.field === 'vigilance' && filter.key === 'chronicIllness.diabetes.medication') {
    propsVigilance = vigilance2.filter(x => x.chronicIllness.diabetes.medication === filter.value)
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field === 'vigilance' && filter.key === 'highlighted') {
    propsVigilance = vigilance2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'vigilance') {
    propsVigilance = vigilance2;
  }

  let count = 0;

  const vigilances = propsVigilance.map(vigilance => {

    count = propsVigilance.indexOf(vigilance)+1;

    return (
      <VigilanceItem
        key={count}
        vigilance={vigilance}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        toggleVisitVigilanceHighlighted={props.toggleVisitVigilanceHighlighted}
      />
    );
  });

  return <ul className="fileList">{vigilances}</ul>;
};

export default VisitVigilanceList;
