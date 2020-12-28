import React from 'react';

import BillingItem from '../../items/visit/BillingItem';
import './visitList.css';

const VisitBillingList = props => {

  const {...filter} = props.filter;
  let billing2 = props.billing;
  let propsBilling = [];

  if (filter.field === 'billing' && filter.key === 'title' && filter.value === 'Ascending') {
    propsBilling = billing2.sort((a, b) => (a.title > b.title) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'title' && filter.value === 'Descending') {
    propsBilling = billing2.sort((a, b) => (a.title < b.title) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'type' && filter.value === 'Ascending') {
    propsBilling = billing2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'type' && filter.value === 'Descending') {
    propsBilling = billing2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'amount' && filter.value === 'Ascending') {
    propsBilling = billing2.sort((a, b) => (a.amount > b.amount) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'amount' && filter.value === 'Descending') {
    propsBilling = billing2.sort((a, b) => (a.amount < b.amount) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'description' && filter.value === 'Ascending') {
    propsBilling = billing2.sort((a, b) => (a.description > b.description) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'description' && filter.value === 'Descending') {
    propsBilling = billing2.sort((a, b) => (a.description < b.description) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'notes' && filter.value === 'Ascending') {
    propsBilling = billing2.sort((a, b) => (a.notes > b.notes) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'notes' && filter.value === 'Descending') {
    propsBilling = billing2.sort((a, b) => (a.notes < b.notes) ? 1 : -1);
  }
  if (filter.field === 'billing' && filter.key === 'paid') {
    propsBilling = billing2.filter(x => x.paid === filter.value);
  }
  if (filter.field === 'billing' && filter.key === 'highlighted') {
    propsBilling = billing2.filter(x => x.highlighted === filter.value);
  }
  if (filter.field !== 'billing') {
    propsBilling = billing2;
  }

  let count = 0;

  const billings = propsBilling.map(billing => {

    count = propsBilling.indexOf(billing)+1;

    return (
      <BillingItem
        key={count}
        billing={billing}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
        onAddAttachment={props.onAddAttachment}
        deleteAttachment={props.deleteAttachment}
        updateBillingPaid={props.updateBillingPaid}
        toggleVisitBillingHighlighted={props.toggleVisitBillingHighlighted}
      />
    );
  });

  return <ul className="visitList">{billings}</ul>;
};

export default VisitBillingList;
