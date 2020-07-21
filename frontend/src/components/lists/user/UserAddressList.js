import React from 'react';

import AddressItem from '../../items/user/AddressItem';
import './UserList.css';

const UserAddressList = props => {

  const {...filter} = props.filter;
  let addresses2 = props.addresses;
  let propsAddresses = [];

  // if (filter.field === 'userMasterList' && filter.key === 'username' && filter.value === 'Ascending') {
  //   propsAddresses = addresses2.sort((a, b) => (a.username > b.username) ? 1 : -1);
  // }
  // if (filter.field === 'userMasterList' && filter.key === 'username' && filter.value === 'Descending') {
  //   propsAddresses = addresses2.sort((a, b) => (a.username < b.username) ? 1 : -1);
  // }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'address') {
    propsAddresses = addresses2;
  }

  let count = 0;

  const addresses = propsAddresses.map(address => {

    count = propsAddresses.indexOf(address)+1;

    return (
      <AddressItem
        key={count}
        address={address}
      />
    );
  });

  return <ul className="addressList">{addresses}</ul>;
};

export default UserAddressList;
