import React from 'react';

import AddressItem from '../../items/user/AddressItem';
import './UserList.css';

const PatientAddressList = props => {

  const {...filter} = props.filter;
  let addresses2 = props.addresses;
  let propsAddresses = [];

  if (filter.field === 'address' && filter.key === 'number' && filter.value === 'Ascending') {
    propsAddresses = addresses2.sort((a, b) => (a.number > b.number) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'number' && filter.value === 'Descending') {
    propsAddresses = addresses2.sort((a, b) => (a.number < b.number) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'street' && filter.value === 'Ascending') {
    propsAddresses = addresses2.sort((a, b) => (a.street > b.street) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'street' && filter.value === 'Descending') {
    propsAddresses = addresses2.sort((a, b) => (a.street < b.street) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'town' && filter.value === 'Ascending') {
    propsAddresses = addresses2.sort((a, b) => (a.town > b.town) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'town' && filter.value === 'Descending') {
    propsAddresses = addresses2.sort((a, b) => (a.town < b.town) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'city' && filter.value === 'Ascending') {
    propsAddresses = addresses2.sort((a, b) => (a.city > b.city) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'city' && filter.value === 'Descending') {
    propsAddresses = addresses2.sort((a, b) => (a.city < b.city) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'parish' && filter.value === 'Ascending') {
    propsAddresses = addresses2.sort((a, b) => (a.parish > b.parish) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'parish' && filter.value === 'Descending') {
    propsAddresses = addresses2.sort((a, b) => (a.parish < b.parish) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'country' && filter.value === 'Ascending') {
    propsAddresses = addresses2.sort((a, b) => (a.country > b.country) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'country' && filter.value === 'Descending') {
    propsAddresses = addresses2.sort((a, b) => (a.country < b.country) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'postalCode' && filter.value === 'Ascending') {
    propsAddresses = addresses2.sort((a, b) => (a.postalCode > b.postalCode) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'postalCode' && filter.value === 'Descending') {
    propsAddresses = addresses2.sort((a, b) => (a.postalCode < b.postalCode) ? 1 : -1);
  }
  if (filter.field === 'address' && filter.key === 'primary') {
    propsAddresses = addresses2.filter(x => x.primary === filter.value);
  }
  if (filter.field !== 'address') {
    propsAddresses = addresses2;
  }

  let count = 0;

  const addresses = propsAddresses.map(address => {

    count = propsAddresses.indexOf(address)+1;

    return (
      <AddressItem
        count={count}
        address={address}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        makePrimary={props.makePrimary}
        canUpdate={props.canUpdate}
        startUpdate={props.startUpdate}
      />
    );
  });

  return <ul className="addressList">{addresses}</ul>;
};

export default PatientAddressList;
