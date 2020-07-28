import React from 'react';

import TagItem from '../../items/patient/TagItem';
import './UserList.css';

const PatientTagList = props => {

  const {...filter} = props.filter;
  let tags2 = props.tags;
  let propsTags = [];

  if (filter.field === 'tag' && filter.key === 'tag' && filter.value === 'Ascending') {
    propsTags = tags2.sort((a, b) => (a > b) ? 1 : -1);
  }
  if (filter.field === 'tag' && filter.key === 'tag' && filter.value === 'Descending') {
    propsTags = tags2.sort((a, b) => (a < b) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'tag') {
    propsTags = tags2;
  }

  let count = 0;

  const tags = propsTags.map(tag => {

    count = propsTags.indexOf(tag)+1;

    return (
      <TagItem
        key={count}
        tag={tag}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="noteList">{tags}</ul>;
};

export default PatientTagList;
