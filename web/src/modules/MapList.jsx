import React from 'react';
import { Link } from 'react-router';

function MapList(props) {
  const items = Object.keys(props.items).map(id => {
    const item = props.items[id];
    const link = `/${props.resource}/${id}`;
    return (
      <li key={id}><Link to={link}>{item.name}</Link></li>
    )
  });

  return (
    <ul>{items}</ul>
  );
}

export default MapList;
