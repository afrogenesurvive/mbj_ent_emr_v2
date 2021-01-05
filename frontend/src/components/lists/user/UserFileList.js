import React from 'react';

import FileItem from '../../items/user/FileItem';
import './UserList.css';

const UserFileList = props => {

  const {...filter} = props.filter;
  let files2 = props.files;
  let propsFiles = [];

  if (filter.field === 'file' && filter.key === 'name' && filter.value === 'Ascending') {
    propsFiles = files2.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'file' && filter.key === 'name' && filter.value === 'Descending') {
    propsFiles = files2.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'file' && filter.key === 'type' && filter.value === 'Ascending') {
    propsFiles = files2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'file' && filter.key === 'type' && filter.value === 'Descending') {
    propsFiles = files2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'file' && filter.key === 'link' && filter.value === 'Ascending') {
    propsFiles = files2.sort((a, b) => (a.path > b.path) ? 1 : -1);
  }
  if (filter.field === 'file' && filter.key === 'link' && filter.value === 'Descending') {
    propsFiles = files2.sort((a, b) => (a.path < b.path) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field === 'file' && filter.key === 'highlighted') {
    propsFiles = files2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'file') {
    propsFiles = files2;
  }

  let count = 0;

  const files = propsFiles.map(file => {

    count = propsFiles.indexOf(file)+1;

    return (
      <FileItem
        key={count}
        file={file}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        toggleStaffFileHighlighted={props.toggleStaffFileHighlighted}
      />
    );
  });

  return <ul className="fileList">{files}</ul>;
};

export default UserFileList;
