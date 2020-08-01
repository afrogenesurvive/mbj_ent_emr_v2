import React from 'react';

import UserItem from '../../items/user/UserItem';
import './UserList.css';

const UserList = props => {

  const {...filter} = props.filter;
  let users2 = props.users;
  let propsUsers = [];

  if (filter.field === 'staff' && filter.key === 'name' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'name' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'username' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.username > b.username) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'username' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.username < b.username) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'title' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'title' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'role' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.role > b.role) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'role' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.role < b.role) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'dob' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.dob > b.dob) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'dob' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.dob < b.dob) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'age' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.age > b.age) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'age' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.age < b.age) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'gender' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.gender > b.gender) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'gender' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.gender < b.gender) ? 1 : -1);
  }
  if (filter.field === 'staff' && filter.key === 'loggedIn') {
    propsUsers = users2.filter(x => x.loggedIn === filter.value);
  }
  if (filter.field !== 'staff') {
    propsUsers = users2;
  }

  let count = 0;

  const users = propsUsers.map(user => {

    count = propsUsers.indexOf(user)+1;

    return (
      <UserItem
        key={count}
        user={user}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        showDetails={props.showDetails}
        appointmentPage={props.appointmentPage}
        visitPage={props.visitPage}
        selectUser={props.selectUser}
      />
    );
  });

  return <ul className="userList">{users}</ul>;
};

export default UserList;
