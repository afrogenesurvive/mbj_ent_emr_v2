import React from 'react';

import NoteItem from '../../items/user/NoteItem';
import './UserList.css';

const UserNoteList = props => {

  const {...filter} = props.filter;
  let notes2 = props.notes;
  let propsNotes = [];

  if (filter.field === 'note' && filter.key === 'note' && filter.value === 'Ascending') {
    propsNotes = notes2.sort((a, b) => (a > b) ? 1 : -1);
  }
  if (filter.field === 'note' && filter.key === 'note' && filter.value === 'Descending') {
    propsNotes = notes2.sort((a, b) => (a < b) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'note') {
    propsNotes = notes2;
  }

  let count = 0;

  const notes = propsNotes.map(note => {

    count = propsNotes.indexOf(note)+1;

    return (
      <NoteItem
        key={count}
        note={note}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="noteList">{notes}</ul>;
};

export default UserNoteList;
