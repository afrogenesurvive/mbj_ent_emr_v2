import React from 'react';

import SystematicInquiryItem from '../../items/visit/SystematicInquiryItem';
import './visitList.css';

const VisitSystematicInquiryList = props => {

  const {...filter} = props.filter;
  let systematicInquirys2 = props.systematicInquiry;
  let propsSystematicInquirys = [];

  if (filter.field === 'systematicInquiry' && filter.key === 'title' && filter.value === 'Ascending') {
    propsSystematicInquirys = systematicInquirys2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'systematicInquiry' && filter.key === 'title' && filter.value === 'Descending') {
    propsSystematicInquirys = systematicInquirys2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'systematicInquiry' && filter.key === 'description' && filter.value === 'Ascending') {
    propsSystematicInquirys = systematicInquirys2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'systematicInquiry' && filter.key === 'description' && filter.value === 'Descending') {
    propsSystematicInquirys = systematicInquirys2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'systematicInquiry') {
    propsSystematicInquirys = systematicInquirys2;
  }

  let count = 0;

  const systematicInquirys = propsSystematicInquirys.map(systematicInquiry => {

    count = propsSystematicInquirys.indexOf(systematicInquiry)+1;

    return (
      <SystematicInquiryItem
        key={count}
        systematicInquiry={systematicInquiry}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
      />
    );
  });

  return <ul className="visitList">{systematicInquirys}</ul>;
};

export default VisitSystematicInquiryList;
