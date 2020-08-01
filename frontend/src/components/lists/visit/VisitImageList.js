import React from 'react';

import ImageItem from '../../items/visit/ImageItem';
import './visitList.css';

const VisitImageList = props => {

  const {...filter} = props.filter;
  let images2 = props.images;
  let propsImages = [];

  if (filter.field === 'image' && filter.key === 'name' && filter.value === 'Ascending') {
    propsImages = images2.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }
  if (filter.field === 'image' && filter.key === 'name' && filter.value === 'Descending') {
    propsImages = images2.sort((a, b) => (a.name < b.name) ? 1 : -1);
  }
  if (filter.field === 'image' && filter.key === 'type' && filter.value === 'Ascending') {
    propsImages = images2.sort((a, b) => (a.type > b.type) ? 1 : -1);
  }
  if (filter.field === 'image' && filter.key === 'type' && filter.value === 'Descending') {
    propsImages = images2.sort((a, b) => (a.type < b.type) ? 1 : -1);
  }
  if (filter.field === 'image' && filter.key === 'link' && filter.value === 'Ascending') {
    propsImages = images2.sort((a, b) => (a.path > b.path) ? 1 : -1);
  }
  if (filter.field === 'image' && filter.key === 'link' && filter.value === 'Descending') {
    propsImages = images2.sort((a, b) => (a.path < b.path) ? 1 : -1);
  }
  // if (filter.field === 'userMasterList' && filter.key === 'role') {
  //   propsAddresses = addresses2.filter(x => x.role === filter.value);
  // }
  if (filter.field !== 'image') {
    propsImages = images2;
  }

  let count = 0;

  const images = propsImages.map(image => {

    count = propsImages.indexOf(image)+1;

    return (
      <ImageItem
        key={count}
        image={image}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="imageList">{images}</ul>;
};

export default VisitImageList;
